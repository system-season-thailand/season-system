// Dynamic Thank You page text controller
(function () {
    function byId(id) { return document.getElementById(id); }

    function setThankYouLines(lines) {
        var container = document.querySelector('.thank_you_text');
        if (!container) return;
        // Ensure exactly 5 rows
        var desired = (lines && lines.length) ? lines.slice(0, 5) : [];
        while (desired.length < 5) desired.push('');

        // If <p> elements exist, reuse them; otherwise, create
        var ps = container.querySelectorAll('p');
        if (ps.length === 0) {
            for (var i = 0; i < 5; i++) {
                var p = document.createElement('p');
                p.textContent = desired[i];
                container.appendChild(p);
            }
            return;
        }
        for (var j = 0; j < Math.min(5, ps.length); j++) {
            ps[j].textContent = desired[j];
        }
    }

    function setThankYouTitle(text) {
        var titleEl = document.querySelector('.thank_you_title');
        if (!titleEl) return;
        titleEl.textContent = text || 'Thank You';
    }

    function setHeaderGlowFor(company) {
        var glow = document.querySelector('.thank_you_header_glow');
        if (!glow) return;
        var bg;
        switch (company) {
            case 'فيد':
                // Dark pink family
                bg = 'linear-gradient(to bottom, rgba(138, 44, 74, 0.88) 0%, rgba(179, 71, 107, 0.58) 40%, rgba(255, 255, 255, 0) 100%)';
                break;
            case 'مغادر':
                // Dark blue family
                bg = 'linear-gradient(to bottom, rgba(5, 52, 90, 0.9) 0%, rgba(10, 68, 120, 0.55) 40%, rgba(255, 255, 255, 0) 100%)';
                break;
            case 'سكاي جلوبال':
                // Dark green family
                bg = 'linear-gradient(to bottom, rgba(146, 205, 220, 0.9) 0%, rgba(124, 198, 242, 0.55) 40%, rgba(255, 255, 255, 0) 100%)';
                break;
            case 'ترافل جت':
                // Light blue family
                bg = 'linear-gradient(to bottom, rgba(58, 165, 217, 0.9) 0%, rgba(124, 198, 242, 0.55) 40%, rgba(255, 255, 255, 0) 100%)';
                break;
            default:
                // Default matches current CSS palette
                bg = 'linear-gradient(to bottom, rgba(164, 177, 151, 0.8) 0%, rgba(164, 177, 151, 0.4) 40%, rgba(255, 255, 255, 0) 100%)';
        }
        glow.style.background = bg;
    }

    function getCompanyName() {
        // Primary: value from the input field
        var input = byId('clint_company_name_input_id');
        var name = input ? (input.value || '').trim() : '';

        // Fallback: sometimes the app stores/reflects the company here
        if (!name) {
            var byValue = byId('company_by_value_p_id');
            if (byValue && byValue.innerText) {
                name = byValue.innerText.trim();
            }
        }

        return name;
    }

    function buildLinesFor(company) {
        // Default placeholder lines
        var placeholder = [
            'Happy To Welcome You',
            `We're very happy to have you with us, and our goal from the beginning was for you to enjoy a comfortable journey and services that suit you. Your trust means a lot to us, and it is what makes us always strive to live up to your expectations.`,
            'We hope your trip is full of sweet moments and unforgettable memories.',
            `We're always waiting for you on more beautiful upcoming trips.`,
            '✨️ Your journey with us is not just a service.. it is an experience in which we cherish you.'
        ];

        switch (company) {
            case 'فيد':
                return [
                    'At Vid Travel, our true joy is your satisfaction and happiness during your journey with us.',
                    'Our work always has one goal: to provide you with comfort and care that will make your experience different and unique.',
                    '✨️ We look forward to future trips that will bring us together, to be more beautiful and closer to your hearts.'
                ];
            case 'مغادر':
                return [
                    'Your journey with us is more than just travel.',
                    'with Moghader, we make sure your experience is full of comfort and care.',
                    'Thank you for your trust in us.',
                    'Your happiness and satisfaction are our true success, and we hope that the memories of your beautiful trip will accompany you long after your return.'
                ];
            case 'سكاي جلوبال':
                return [
                    'We at Sky Global are delighted that you have chosen us to be part of your journey. We have made sure that everything is arranged and comfortable so that you can enjoy an experience that meets your expectations and exceeds them.',
                    '✨️ We wish you beautiful memories, and we will be honored to serve you on future trips.'
                ];
            case 'ترافل جت':
                return [
                    'We believe that travel is not just about moving from one place to another, but rather an art of creating exceptional moments.',
                    'Thank you for choosing Travel Jet as your travel companion.',
                    'It was an honor for us to put your comfort and happiness at the forefront of our concerns.',
                    'We hope we have given you a luxurious travel experience and long-lasting memories.'
                ];
            default:
                return placeholder;
        }
    }

    function buildTitleFor(company) {
        switch (company) {
            case 'فيد':
                return '💎 Sincere Thanks From VID';
            case 'مغادر':
                return '💫 MOGHADER is Proud of You';
            case 'سكاي جلوبال':
                return '✨️ Thanks And Appreciation From SKY GLOBAL';
            case 'ترافل جت':
                return 'TRAVEL GET is Happy To Serve You.';
            default:
                return '💌 Thanks From Bottom of Heart';
        }
    }

    function updateThankYou() {
        var company = getCompanyName();
        setThankYouLines(buildLinesFor(company));
        setThankYouTitle(buildTitleFor(company));
        setHeaderGlowFor(company);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', updateThankYou);
    } else {
        updateThankYou();
    }

    // React to changes in the company input value (click selection / programmatic)
    var companyInput = byId('clint_company_name_input_id');
    if (companyInput) {
        companyInput.addEventListener('input', updateThankYou);
        companyInput.addEventListener('change', updateThankYou);
        // Note: programmatic changes to input.value do NOT mutate attributes.
        // Add a lightweight watcher to keep the thank-you text in sync.
        var lastCompany = getCompanyName();
        setInterval(function () {
            var current = getCompanyName();
            if (current !== lastCompany) {
                lastCompany = current;
                updateThankYou();
            }
        }, 500);
    }
})();

