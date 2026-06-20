/* ============================================================
   AGCAM — Application Logic
   Automated Guest Communication Augmentation Module
   The Verdant Retreat
   ============================================================ */

(() => {
    'use strict';

    // ─── Configuration ─────────────────────────────────────────
    const CONFIG = {
        LLM_API_URL: 'https://api.verdanthq.ai/generate-reply',
        BOOKING_API_BASE: 'https://verdant-crm.mockapi.io/bookings',
        // For POC simulation, we use jsonplaceholder as a stand-in
        BOOKING_MOCK_URL: 'https://jsonplaceholder.typicode.com/users',
        API_KEY: 'DUMMY_VERDANT_API_KEY_12345',
        MODEL_ID: 'verdant-concierge-v3',
        TEMPERATURE: 0.5,
        MAX_TOKENS: 150,
        ERROR_DISPLAY_DURATION_MS: 7000,
        COPY_FEEDBACK_DURATION_MS: 2000,
    };

    // ─── System Prompt Templates ───────────────────────────────
    const BASE_SYSTEM_PROMPT =
        "You are a highly professional, polite, and efficient concierge for 'The Verdant Retreat' luxury boutique hotel. " +
        "Your primary goal is to provide clear, concise, and helpful information. " +
        "All responses *must* be under 4 sentences. " +
        "If the query is ambiguous or requires external data, politely state that you are unable to assist with that specific request at this moment and suggest direct contact with the front desk.";

    const TONE_MODIFIERS = {
        standard: '',
        warm:
            " Ensure your tone is exceptionally warm, friendly, and welcoming, reflecting The Verdant Retreat's personalized hospitality and luxurious brand standards.",
        concise:
            " Keep your response extremely concise and direct. Prioritize clarity and brevity above all else while maintaining professional courtesy.",
        apologetic:
            " Adopt a sincerely apologetic and empathetic tone appropriate for service recovery situations. Acknowledge any inconvenience and reassure the guest that their satisfaction is your highest priority.",
    };

    // ─── Mock Booking Data ─────────────────────────────────────
    // Synthetic fields to overlay on jsonplaceholder /users data
    const MOCK_BOOKING_OVERLAYS = {
        1:  { check_in_date: '2026-07-01', check_out_date: '2026-07-05', room_type: 'Deluxe Suite' },
        2:  { check_in_date: '2026-07-03', check_out_date: '2026-07-06', room_type: 'Premium King' },
        3:  { check_in_date: '2026-07-10', check_out_date: '2026-07-14', room_type: 'Garden View Double' },
        4:  { check_in_date: '2026-07-15', check_out_date: '2026-07-18', room_type: 'Verdant Penthouse' },
        5:  { check_in_date: '2026-07-20', check_out_date: '2026-07-23', room_type: 'Standard Queen' },
        6:  { check_in_date: '2026-08-01', check_out_date: '2026-08-04', room_type: 'Deluxe Suite' },
        7:  { check_in_date: '2026-08-05', check_out_date: '2026-08-09', room_type: 'Mountain View King' },
        8:  { check_in_date: '2026-08-12', check_out_date: '2026-08-15', room_type: 'Premium King' },
        9:  { check_in_date: '2026-08-18', check_out_date: '2026-08-22', room_type: 'Garden View Double' },
        10: { check_in_date: '2026-08-25', check_out_date: '2026-08-28', room_type: 'Verdant Penthouse' },
    };

    // ─── DOM References ────────────────────────────────────────
    const DOM = {
        // Login
        loginScreen:       document.getElementById('login-screen'),
        staffIdInput:      document.getElementById('staff-id'),
        loginButton:       document.getElementById('login-button'),
        loginError:        document.getElementById('login-error'),

        // App
        appMain:           document.getElementById('app-main'),
        loggedInStaffId:   document.getElementById('logged-in-staff-id'),
        logoutButton:      document.getElementById('logout-button'),

        // Input fields
        emailSubject:      document.getElementById('email-subject'),
        emailBodyInput:    document.getElementById('email-body-input'),
        guestName:         document.getElementById('guest-name'),
        bookingId:         document.getElementById('booking-id'),
        toneSelector:      document.getElementById('tone-selector'),

        // Char counters
        subjectCharCount:  document.getElementById('subject-char-count'),
        bodyCharCount:     document.getElementById('body-char-count'),

        // Action
        generateButton:    document.getElementById('generate-reply-button'),
        generateSpinner:   document.getElementById('generate-spinner'),
        generateButtonText:document.getElementById('generate-button-text'),
        apiErrorMessage:   document.getElementById('api-error-message'),
        bookingWarning:    document.getElementById('booking-warning'),

        // Output
        generatedReply:    document.getElementById('generated-reply'),
        copyButton:        document.getElementById('copy-button'),
        copyButtonText:    document.getElementById('copy-button-text'),

        // Meta
        replyMeta:         document.getElementById('reply-meta'),
        metaTone:          document.getElementById('meta-tone'),
        metaTimestamp:     document.getElementById('meta-timestamp'),
        metaTokens:        document.getElementById('meta-tokens'),
    };

    // ─── State ─────────────────────────────────────────────────
    let currentStaffId = null;
    let isGenerating = false;
    let errorTimeout = null;
    let generatedReplyContent = '';

    // ─── Initialization ────────────────────────────────────────
    function init() {
        bindLoginEvents();
        bindInputEvents();
        bindActionEvents();
        bindOutputEvents();
    }

    // ============================================================
    //  PHASE 4.2: Authentication (Mock)
    // ============================================================

    function bindLoginEvents() {
        DOM.loginButton.addEventListener('click', handleLogin);
        DOM.staffIdInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleLogin();
        });
        DOM.logoutButton.addEventListener('click', handleLogout);
    }

    function handleLogin() {
        const staffId = DOM.staffIdInput.value.trim();
        if (!staffId) {
            DOM.loginError.textContent = 'Please enter your Staff ID to continue.';
            DOM.staffIdInput.focus();
            return;
        }
        currentStaffId = staffId;
        DOM.loggedInStaffId.textContent = staffId;
        DOM.loginScreen.classList.add('hidden');
        DOM.appMain.classList.remove('hidden');
        DOM.loginError.textContent = '';
        console.log(`[AGCAM] Staff login: ${staffId} at ${new Date().toISOString()}`);
    }

    function handleLogout() {
        currentStaffId = null;
        DOM.staffIdInput.value = '';
        DOM.loginScreen.classList.remove('hidden');
        DOM.appMain.classList.add('hidden');
        resetForm();
    }

    // ============================================================
    //  INPUT HANDLING & VALIDATION
    // ============================================================

    function bindInputEvents() {
        // Character counters
        DOM.emailSubject.addEventListener('input', () => {
            DOM.subjectCharCount.textContent = `${DOM.emailSubject.value.length} / 120`;
        });

        DOM.emailBodyInput.addEventListener('input', () => {
            DOM.bodyCharCount.textContent = `${DOM.emailBodyInput.value.length} / 2000`;
            updateGenerateButtonState();
        });
    }

    function updateGenerateButtonState() {
        const hasBody = DOM.emailBodyInput.value.trim().length > 0;
        DOM.generateButton.disabled = !hasBody || isGenerating;
    }

    // ============================================================
    //  PHASE 1 & 2: Core LLM Integration & Workflow
    // ============================================================

    function bindActionEvents() {
        DOM.generateButton.addEventListener('click', handleGenerateReply);
    }

    async function handleGenerateReply() {
        if (isGenerating) return;

        const emailBody = DOM.emailBodyInput.value.trim();
        if (!emailBody) return;

        setLoadingState(true);
        hideError();
        hideBookingWarning();

        try {
            // Phase 3.3: Fetch booking details if Booking ID is provided
            let bookingDetails = null;
            const bookingId = DOM.bookingId.value.trim();
            if (bookingId) {
                bookingDetails = await fetchBookingDetails(bookingId);
            }

            // Phase 3.1: Build the dynamic prompt
            const userPrompt = buildUserPrompt(bookingDetails);

            // Phase 3.2: Build the system prompt with tone modifier
            const systemPrompt = buildSystemPrompt();

            // Phase 1.1: Build the LLM payload
            const payload = {
                model: CONFIG.MODEL_ID,
                temperature: CONFIG.TEMPERATURE,
                max_tokens: CONFIG.MAX_TOKENS,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user',   content: userPrompt },
                ],
            };

            // Phase 1.1: Call the LLM API
            const replyText = await callLLMAPI(payload);

            // Display the result
            displayReply(replyText);

            // Phase 4.3: Audit logging
            logAuditTrail(replyText);

        } catch (err) {
            // Phase 4.1: Error reporting
            showError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoadingState(false);
        }
    }

    // ─── LLM API Call ──────────────────────────────────────────
    async function callLLMAPI(payload) {
        try {
            const response = await fetch(CONFIG.LLM_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': CONFIG.API_KEY,
                },
                body: JSON.stringify(payload),
            });

            // For POC: since the mock endpoint won't exist, we simulate
            // In production, this would be a real API call
            if (!response.ok) {
                const statusCode = response.status;
                throw new Error(
                    `Failed to generate reply. Please check connectivity or try again. ` +
                    `If the issue persists, contact IT support (Error Code: ${statusCode}).`
                );
            }

            const data = await response.json();

            // Phase 1.1: Response Handling – extract from nested path
            if (data.error) {
                throw new Error(
                    `Failed to generate reply. Please check connectivity or try again. ` +
                    `If the issue persists, contact IT support (Error Code: ${data.error.code || 'API_ERROR'}).`
                );
            }

            if (data?.response?.choices?.[0]?.message?.content) {
                return data.response.choices[0].message.content;
            }

            // Fallback: try common OpenAI-style response format
            if (data?.choices?.[0]?.message?.content) {
                return data.choices[0].message.content;
            }

            throw new Error(
                'Failed to generate reply. Please check connectivity or try again. ' +
                'If the issue persists, contact IT support (Error Code: MALFORMED_RESPONSE).'
            );

        } catch (err) {
            // Network errors or fetch failures
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                throw new Error(
                    'Failed to generate reply. Please check connectivity or try again. ' +
                    'If the issue persists, contact IT support (Error Code: NETWORK_ERROR).'
                );
            }

            // For POC: since the real API doesn't exist, simulate a response
            // This block handles the expected fetch failure during POC demo
            console.warn('[AGCAM] LLM API unavailable (expected in POC mode). Generating simulated response.');
            return generateSimulatedReply(payload);
        }
    }

    // ─── Simulated Reply (POC Fallback) ────────────────────────
    function generateSimulatedReply(payload) {
        const userMsg = payload.messages[1].content;
        const tone = DOM.toneSelector.value;
        const guestName = DOM.guestName.value.trim();

        // Extract a greeting name
        const greeting = guestName ? `Dear ${guestName}` : 'Dear Valued Guest';

        // Determine response based on keywords in the email body
        const bodyLower = userMsg.toLowerCase();

        let responseBody;

        if (bodyLower.includes('check-in') || bodyLower.includes('check in') || bodyLower.includes('arrival')) {
            responseBody = `Thank you for reaching out. Our standard check-in time is 3:00 PM, though we are happy to accommodate early arrivals when availability permits. Please feel free to contact us directly at the front desk to arrange any special timing, and we will do our utmost to ensure your arrival is seamless.`;
        } else if (bodyLower.includes('check-out') || bodyLower.includes('check out') || bodyLower.includes('departure')) {
            responseBody = `We appreciate your inquiry regarding departure arrangements. Our standard check-out time is 11:00 AM, and late check-out may be arranged subject to availability. Please don't hesitate to reach out to our front desk team to discuss your preferences.`;
        } else if (bodyLower.includes('cancel') || bodyLower.includes('refund')) {
            responseBody = `We understand that plans can change, and we are here to assist you. Our cancellation policy allows complimentary cancellation up to 48 hours prior to arrival. For specific details regarding your reservation, please contact our reservations team directly.`;
        } else if (bodyLower.includes('spa') || bodyLower.includes('wellness') || bodyLower.includes('massage')) {
            responseBody = `Thank you for your interest in our wellness offerings. The Verdant Spa features a curated selection of treatments designed to rejuvenate and restore. We recommend booking your preferred treatment in advance to ensure availability during your stay.`;
        } else if (bodyLower.includes('restaurant') || bodyLower.includes('dining') || bodyLower.includes('breakfast') || bodyLower.includes('dinner')) {
            responseBody = `We are delighted by your interest in our culinary experiences. Our award-winning restaurant offers farm-to-table Vermont cuisine with seasonal menus crafted by our executive chef. Reservations are recommended, and our concierge team is happy to assist with any dietary requirements.`;
        } else if (bodyLower.includes('parking') || bodyLower.includes('car') || bodyLower.includes('transport')) {
            responseBody = `Thank you for your inquiry. We offer complimentary valet parking for all registered guests, and our concierge can arrange private transportation to local attractions. Please let us know your specific needs so we may prepare accordingly.`;
        } else if (bodyLower.includes('pet') || bodyLower.includes('dog') || bodyLower.includes('animal')) {
            responseBody = `We appreciate your inquiry about our pet policy. The Verdant Retreat warmly welcomes well-behaved dogs under 40 pounds in our designated pet-friendly rooms. An additional nightly fee applies, and our team will ensure a comfortable stay for both you and your companion.`;
        } else if (bodyLower.includes('complaint') || bodyLower.includes('disappointed') || bodyLower.includes('unhappy') || bodyLower.includes('issue') || bodyLower.includes('problem')) {
            responseBody = `We sincerely apologize for any inconvenience you have experienced. Your satisfaction is of the utmost importance to us, and we take your feedback very seriously. Our management team has been notified, and we would appreciate the opportunity to make this right — please contact us directly at your earliest convenience.`;
        } else {
            responseBody = `Thank you for contacting The Verdant Retreat. We appreciate your inquiry and want to ensure you receive the most accurate and helpful information. For this specific request, we recommend contacting our front desk directly at (802) 555-VERD so that our team may assist you personally.`;
        }

        // Apply tone adjustments
        if (tone === 'warm') {
            responseBody = responseBody.replace('Thank you for', 'How wonderful to hear from you! Thank you so much for');
            responseBody = responseBody.replace('We appreciate', 'We truly appreciate');
        } else if (tone === 'apologetic') {
            responseBody = `We sincerely apologize for any concern this may have caused. ` + responseBody;
        }

        return `${greeting},\n\n${responseBody}\n\nWith warmest regards,\nThe Verdant Retreat Concierge Team`;
    }

    // ─── Booking Details Fetch (Phase 3.3) ─────────────────────
    async function fetchBookingDetails(bookingId) {
        try {
            // Extract numeric ID if present in the booking reference
            const numericId = extractNumericId(bookingId);
            if (!numericId || numericId < 1 || numericId > 10) {
                console.warn(`[AGCAM] Booking ID '${bookingId}' does not map to a known mock record.`);
                showBookingWarning('Could not retrieve booking details. Generating reply without specific booking context.');
                return null;
            }

            // Use jsonplaceholder as POC stand-in
            const response = await fetch(`${CONFIG.BOOKING_MOCK_URL}/${numericId}`);

            if (!response.ok) {
                console.error(`[AGCAM] Booking API returned status ${response.status} for ID '${bookingId}'`);
                showBookingWarning('Could not retrieve booking details. Generating reply without specific booking context.');
                return null;
            }

            const userData = await response.json();

            // Map jsonplaceholder user data to booking schema + overlay synthetic fields
            const overlay = MOCK_BOOKING_OVERLAYS[numericId] || {
                check_in_date: '2026-07-01',
                check_out_date: '2026-07-04',
                room_type: 'Standard Room',
            };

            return {
                bookingId: bookingId,
                guestName: userData.name,
                check_in_date: overlay.check_in_date,
                check_out_date: overlay.check_out_date,
                room_type: overlay.room_type,
            };

        } catch (err) {
            // Phase 4.1: Booking API failures must not block main generation
            console.error('[AGCAM] Booking API fetch error:', err);
            showBookingWarning('Could not retrieve booking details. Generating reply without specific booking context.');
            return null;
        }
    }

    function extractNumericId(bookingId) {
        // Try to find a numeric segment in the booking reference
        const match = bookingId.match(/(\d+)/);
        return match ? parseInt(match[1], 10) : null;
    }

    // ─── Prompt Construction (Phase 3.1) ───────────────────────
    function buildUserPrompt(bookingDetails) {
        const parts = [];

        // Guest Name (if provided)
        const guestName = DOM.guestName.value.trim();
        if (guestName) {
            parts.push(`Guest Name: ${guestName}.`);
        }

        // Booking Details (if available)
        if (bookingDetails) {
            parts.push(
                `Booking Details: Check-in: ${bookingDetails.check_in_date}, ` +
                `Check-out: ${bookingDetails.check_out_date}, ` +
                `Room Type: ${bookingDetails.room_type}.`
            );
        }

        // Email Subject (if provided)
        const subject = DOM.emailSubject.value.trim();
        if (subject) {
            parts.push(`Subject: ${subject}.`);
        }

        // Email Body (mandatory)
        const body = DOM.emailBodyInput.value.trim();
        parts.push(`Email Body: ${body}`);

        return parts.join(' ');
    }

    // ─── System Prompt with Tone (Phase 3.2) ───────────────────
    function buildSystemPrompt() {
        const tone = DOM.toneSelector.value;
        return BASE_SYSTEM_PROMPT + (TONE_MODIFIERS[tone] || '');
    }

    // ============================================================
    //  OUTPUT DISPLAY & INTERACTIONS (Phase 2.3)
    // ============================================================

    function bindOutputEvents() {
        DOM.copyButton.addEventListener('click', handleCopyToClipboard);
    }

    function displayReply(text) {
        generatedReplyContent = text;

        // Apply content to display area
        DOM.generatedReply.innerHTML = '';
        DOM.generatedReply.classList.add('has-content');

        // Animate the text appearing line by line
        const lines = text.split('\n');
        lines.forEach((line) => {
            const p = document.createElement('p');
            p.textContent = line;
            if (!line.trim()) p.innerHTML = '&nbsp;'; // preserve blank lines
            DOM.generatedReply.appendChild(p);
        });

        // Enable copy button
        DOM.copyButton.disabled = false;

        // Show metadata
        const toneLabels = {
            standard: 'Standard Professional',
            warm: 'Warm & Welcoming',
            concise: 'Concise & Direct',
            apologetic: 'Apologetic (Service Recovery)',
        };

        DOM.metaTone.textContent = toneLabels[DOM.toneSelector.value] || DOM.toneSelector.value;
        DOM.metaTimestamp.textContent = new Date().toLocaleString();
        DOM.metaTokens.textContent = `~${Math.min(CONFIG.MAX_TOKENS, Math.ceil(text.split(/\s+/).length * 1.3))} tokens`;
        DOM.replyMeta.classList.remove('hidden');
    }

    async function handleCopyToClipboard() {
        if (!generatedReplyContent) return;

        try {
            await navigator.clipboard.writeText(generatedReplyContent);
            DOM.copyButtonText.textContent = '✓ Copied!';
            DOM.copyButton.classList.add('copied');

            setTimeout(() => {
                DOM.copyButtonText.textContent = 'Copy to Clipboard';
                DOM.copyButton.classList.remove('copied');
            }, CONFIG.COPY_FEEDBACK_DURATION_MS);

        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = generatedReplyContent;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                DOM.copyButtonText.textContent = '✓ Copied!';
                DOM.copyButton.classList.add('copied');
                setTimeout(() => {
                    DOM.copyButtonText.textContent = 'Copy to Clipboard';
                    DOM.copyButton.classList.remove('copied');
                }, CONFIG.COPY_FEEDBACK_DURATION_MS);
            } catch (copyErr) {
                console.error('[AGCAM] Copy failed:', copyErr);
            }
            document.body.removeChild(textArea);
        }
    }

    // ============================================================
    //  UI STATE MANAGEMENT
    // ============================================================

    function setLoadingState(loading) {
        isGenerating = loading;
        DOM.generateButton.disabled = loading;
        DOM.generateSpinner.classList.toggle('hidden', !loading);
        DOM.generateButtonText.textContent = loading
            ? 'Generating Reply...'
            : 'Generate Professional Reply';

        if (!loading) {
            updateGenerateButtonState();
        }
    }

    function showError(message) {
        clearTimeout(errorTimeout);
        DOM.apiErrorMessage.textContent = message;
        DOM.apiErrorMessage.classList.remove('hidden');

        errorTimeout = setTimeout(() => {
            DOM.apiErrorMessage.classList.add('hidden');
        }, CONFIG.ERROR_DISPLAY_DURATION_MS);
    }

    function hideError() {
        clearTimeout(errorTimeout);
        DOM.apiErrorMessage.classList.add('hidden');
    }

    function showBookingWarning(message) {
        DOM.bookingWarning.textContent = message;
        DOM.bookingWarning.classList.remove('hidden');
    }

    function hideBookingWarning() {
        DOM.bookingWarning.classList.add('hidden');
    }

    function resetForm() {
        DOM.emailSubject.value = '';
        DOM.emailBodyInput.value = '';
        DOM.guestName.value = '';
        DOM.bookingId.value = '';
        DOM.toneSelector.value = 'standard';
        DOM.subjectCharCount.textContent = '0 / 120';
        DOM.bodyCharCount.textContent = '0 / 2000';
        DOM.generatedReply.innerHTML = '<p class="reply-placeholder">Generated reply will appear here...</p>';
        DOM.generatedReply.classList.remove('has-content');
        DOM.copyButton.disabled = true;
        DOM.copyButtonText.textContent = 'Copy to Clipboard';
        DOM.copyButton.classList.remove('copied');
        DOM.replyMeta.classList.add('hidden');
        hideError();
        hideBookingWarning();
        generatedReplyContent = '';
        updateGenerateButtonState();
    }

    // ============================================================
    //  PHASE 4.3: Client-Side Audit Logging
    // ============================================================

    function logAuditTrail(replyText) {
        const truncate = (str, len) => (str.length > len ? str.substring(0, len) + '…' : str);

        const auditEntry = {
            timestamp:      new Date().toISOString(),
            staffId:        currentStaffId,
            emailSubject:   truncate(DOM.emailSubject.value.trim() || '(none)', 50),
            emailBody:      truncate(DOM.emailBodyInput.value.trim(), 100),
            generatedReply: truncate(replyText, 100),
            selectedTone:   DOM.toneSelector.options[DOM.toneSelector.selectedIndex].text,
            bookingId:      DOM.bookingId.value.trim() || '(none)',
        };

        console.log('[AGCAM Audit Log]', auditEntry);
    }

    // ─── Boot ──────────────────────────────────────────────────
    document.addEventListener('DOMContentLoaded', init);

})();
