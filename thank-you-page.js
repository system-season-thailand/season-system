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
            'أهلاً وسهلاً بكم',
            'سعدنا جداً بوجودكم معنا، وكان هدفنا من البداية إنكم تستمتعوا برحلة مريحة وخدمات تليق فيكم. ثقتكم تعني لنا الكثير، وهي الي تخلينا نحرص دايماً نكون عند حسن ظنكم.',
            'نتمنى رحلتكم تكون مليانة لحظات حلوة وذكريات ماتُنسى.',
            'وبإنتظاركم دايماً في رحلات قادمة أجمل.',
            '✨️ رحلتكم معنا مو بس خدمة... هي تجربة نعتز فيها بكم.'
        ];

        switch (company) {
            case 'فيد':
                return [
                    'في فيد، فرحتنا الحقيقية هي رضاكم وسعادتكم خلال رحلتكم معنا.',
                    'عملنا دايماً يكون بهدف واحد: إننا نوفر لكم راحة وإهتمام يخلّي تجربتكم مختلفة ومميزة.',
                    '✨️ ننتظر رحلات قادمة تجمعنا بكم، لتكون أجمل وأقرب إلى قلوبكم.'
                ];
            case 'مغادر':
                return [
                    'رحلتكم معنا أكثر من مجرد سفر.',
                    'مع مغادر حرصنا أن تكون تجربتكم مليئة بالراحة والاهتمام.',
                    'نشكركم على ثقتكم بنا.',
                    'فسعادتكم ورضاكم هم نجاحنا الحقيقي، ونتمنى أن ترافقكم ذكريات رحلتكم الجميلة طويلاً حتى بعد العودة.'
                ];
            case 'سكاي جلوبال':
                return [
                    'يسعدنا في سكاي جلوبال أنكم اخترتمونا لنكون جزءا من رحلتكم. حرصنا أن يكون كل شيء مرتبا ومريحًا لكي تستمتعوا بتجربة على قدر توقعاتكم وأكثر.',
                    '✨️ نتمنى لكم ذكريات جميلة، وإن شاء الله نتشرف بخدمتكم في رحلات قادمة.'
                ];
            case 'ترافل جت':
                return [
                    'نؤمن أن السفر ليس مجرد انتقال من مكان لآخر، بل فن لصناعة اللحظات الاستثنائية.',
                    'شكراً لاختياركم ترافل جِت لتكون رفيقة رحلتكم.',
                    'فقد كان شرفاً لنا أن نضع راحتكم وسعادتكم في مقدمة اهتماماتنا.',
                    'ونأمل أن نكون قد منحناكم تجربة سفر راقية وذكريات تدوم طويلاً.'
                ];
            default:
                return placeholder;
        }
    }

    function buildTitleFor(company) {
        switch (company) {
            case 'فيد':
                return '💎 مع خالص الشكر من فيد';
            case 'مغادر':
                return '💫 مغادر تفتخر بكم';
            case 'سكاي جلوبال':
                return '✨️ شكر وتقدير من سكاي جلوبال';
            case 'ترافل جت':
                return 'ترافل جت سعيدة لخدمتكم';
            default:
                return '💌 شكراً من القلب';
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

