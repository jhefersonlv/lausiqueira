document.addEventListener('DOMContentLoaded', () => {
    
    // Animação de entrada inicial
    setTimeout(() => {
        document.documentElement.classList.add('loaded');
    }, 100);

    // Menu Mobile Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    const menuIcon = menuBtn.querySelector('i');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Trocar ícone
        if (navLinks.classList.contains('active')) {
            menuIcon.classList.remove('ph-list');
            menuIcon.classList.add('ph-x');
        } else {
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        }
    });

    // Fechar menu mobile ao clicar em um link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.classList.remove('ph-x');
            menuIcon.classList.add('ph-list');
        });
    });

    // Navbar Sticky / Mudar fundo no scroll
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer para animações de Reveal (fade-up nas seções)
    const reveals = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Anima apenas uma vez
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealObserver.observe(reveal);
    });

    // Lógica do Formulário Personalizado
    const checkboxes = document.querySelectorAll('#customServiceForm input[type="checkbox"]');
    const totalDisplay = document.getElementById('formTotalDisplay');
    const btnAgendar = document.getElementById('btnAgendarPersonalizado');
    
    function formataMoeda(valor) {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function atualizarTotal() {
        let total = 0;
        checkboxes.forEach(cb => {
            if(cb.checked) {
                total += parseFloat(cb.getAttribute('data-price') || 0);
            }
        });
        
        let displayHtml = `Valor estimado: <span style="color: var(--color-accent); font-size: 1.5rem;">${formataMoeda(total)}</span>`;
        if (total > 0) {
            totalDisplay.innerHTML = displayHtml;
        } else {
            totalDisplay.innerHTML = `Valor estimado: <span style="color: var(--color-accent); font-size: 1.5rem;">R$ 0,00</span>`;
        }
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', atualizarTotal);
    });

    if(btnAgendar) {
        btnAgendar.addEventListener('click', () => {
            let servicosSelecionados = [];
            let bonusList = [];
            let total = 0;

            checkboxes.forEach(cb => {
                if(cb.checked) {
                    servicosSelecionados.push('- ' + cb.value);
                    total += parseFloat(cb.getAttribute('data-price') || 0);

                    const bonus = cb.getAttribute('data-bonus');
                    if (bonus) {
                        bonusList.push(bonus);
                    }
                }
            });

            if(servicosSelecionados.length === 0) {
                alert('Por favor, selecione pelo menos um procedimento para agendar.');
                return;
            }

            let msg = `Olá Lau, gostaria de agendar meu atendimento personalizado! ✨\n\n*Procedimentos escolhidos:*\n${servicosSelecionados.join('\n')}\n`;
            
            if (bonusList.length > 0) {
                msg += `\n*Bônus inclusos:* ${bonusList.join(' | ')}\n`;
            }

            msg += `\n*Estimativa total:* ${formataMoeda(total)}\n\nComo faço para confirmar meu horário?`;

            const fone = '5511980221615';
            const url = `https://wa.me/${fone}?text=${encodeURIComponent(msg)}`;
            
            window.open(url, '_blank');
        });
    }

    // --- Lógica do Overlay de Agendamento ---
    const schedulingOverlay = document.getElementById('schedulingOverlay');
    const btnScheduleList = document.querySelectorAll('.btn-schedule');
    const closeOverlay = document.getElementById('closeOverlay');
    const btnYesPersonalize = document.getElementById('btnYesPersonalize');
    const btnNoStandard = document.getElementById('btnNoStandard');
    
    let selectedService = '';

    // Abrir overlay
    btnScheduleList.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedService = btn.getAttribute('data-service');
            schedulingOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Previne scroll ao fundo
        });
    });

    // Fechar overlay
    const hideOverlay = () => {
        schedulingOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (closeOverlay) {
        closeOverlay.addEventListener('click', hideOverlay);
    }
    
    // Fechar ao clicar fora do conteúdo
    if (schedulingOverlay) {
        schedulingOverlay.addEventListener('click', (e) => {
            if (e.target === schedulingOverlay) hideOverlay();
        });
    }

    // Ação: Sim, personalizar
    if (btnYesPersonalize) {
        btnYesPersonalize.addEventListener('click', () => {
            hideOverlay();
            const personalizeSection = document.getElementById('personalize');
            if (personalizeSection) {
                personalizeSection.scrollIntoView({ behavior: 'smooth' });
                
                // Marcar o serviço no formulário se existir
                const checkbox = document.querySelector(`#customServiceForm input[value="${selectedService}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                    // Chamar a função de atualizar total que já existe no escopo
                    atualizarTotal();
                }
            }
        });
    }

    // Ação: Não, agendar agora
    if (btnNoStandard) {
        btnNoStandard.addEventListener('click', () => {
            hideOverlay();
            const fone = '5511980221615';
            const msg = `Olá Lau, gostaria de agendar um(a) ${selectedService}! ✨\n\nComo faço para confirmar meu horário?`;
            const url = `https://wa.me/${fone}?text=${encodeURIComponent(msg)}`;
            window.open(url, '_blank');
        });
    }

});
