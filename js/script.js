document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bankForm');
    const modal = new bootstrap.Modal(document.getElementById('infoModal'));
    const submitButton = form.querySelector('button[type="submit"]');
    const resetButton = document.getElementById('resetBtn');
    let errors = new Set();
    let fieldsInteracted = new Set();

    function isFieldEmpty(field) {
        return field.value.trim() === '';
    }

    function showError(field, message) {
        if (!fieldsInteracted.has(field.id)) return;
        const errorElement = field.closest('tr').querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.color = 'red';
        }
        field.style.borderColor = 'red';
        errors.add(field.id);
        updateSubmitButton();
    }

    function clearError(field) {
        if (!fieldsInteracted.has(field.id)) return;
        const errorElement = field.closest('tr').querySelector('.error-message');
        if (errorElement) {
            errorElement.textContent = '';
            
            
        }
        field.style.borderColor = 'green';
        errors.delete(field.id);
        updateSubmitButton();
    }

    function updateSubmitButton() {
        submitButton.disabled = errors.size > 0;
    }

    function validateField(field) {
        if (!fieldsInteracted.has(field.id)) return true;
        if (isFieldEmpty(field)) {
            showError(field, 'Ce champ est requis');
            return false;
        } else {
            return true;
        }
    }

    function transformNom(input) {
        input.value = input.value.toUpperCase();
        if (validateField(input)) {
            clearError(input);
        }
    }

    function transformPrenom(input) {
        input.value = input.value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        if (validateField(input)) {
            clearError(input);
        }
    }

    function formatDateNaissance(input) {
        let value = input.value.replace(/[\s.-]/g, '/').replace(/[^0-9/]/g, '');
        
        if (value.length > 2 && value.charAt(2) !== '/') {
            value = value.slice(0, 2) + '/' + value.slice(2);
        }
        if (value.length > 5 && value.charAt(5) !== '/') {
            value = value.slice(0, 5) + '/' + value.slice(5);
        }
        
        input.value = value.slice(0, 10);

        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(input.value)) {
            showError(input, 'Format de date invalide (jj/mm/aaaa)');
        } else {
            const [, day, month, year] = input.value.match(dateRegex);
            const date = new Date(year, month - 1, day);
            if (date.getFullYear() != year || date.getMonth() + 1 != month || date.getDate() != day) {
                showError(input, 'Date invalide');
            } else {
                clearError(input);
            }
        }
    }
function validateNom(input) {
    if (!fieldsInteracted.has(input.id)) return true;
    if (isFieldEmpty(input)) {
        showError(input, 'Ce champ est requis');
        return false;
    } else if (input.value.length < 3) {
        showError(input, 'Ce champ doit avoir au moins 3 caractères');
        return false;
    } else {
        return true;
    }
}

function validatePrenom(input) {
    if (!fieldsInteracted.has(input.id)) return true;
    if (isFieldEmpty(input)) {
        showError(input, 'Ce champ est requis');
        return false;
    } else if (input.value.length < 3) {
        showError(input, 'Ce champ doit avoir au moins 3 caractères');
        return false;
    } else {
        return true;
    }
}function validateField(field) {
    if (!fieldsInteracted.has(field.id)) return true;
    switch(field.id) {
        case 'nom':
            return validateNom(field);
        case 'prenom':
            return validatePrenom(field);
       
    }
}function transformNom(input) {
    input.value = input.value.toUpperCase();
    if (validateField(input)) {
        clearError(input);
    }
}

function transformPrenom(input) {
    input.value = input.value.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
    if (validateField(input)) {
        clearError(input);
    }
}
 
    function validateEmail(input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
            showError(input, 'Adresse email invalide');
        } else {
            clearError(input);
        }
    }

    function validateCodeConfidentiel(input) {
        const codeRegex = /^FR\d{5}[A-Z]{3}x$/;
        if (!codeRegex.test(input.value)) {
            showError(input, 'Format invalide. Le code doit commencer par FR, suivi de 5 chiffres, puis 3 lettres majuscules et se terminer par x');
        } else {
            clearError(input);
        }
    }

    function resetForm() {
        form.reset();
        errors.clear();
        fieldsInteracted.clear();
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.style.borderColor = '';
        });
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(el => el.textContent = '');
        updateSubmitButton();
    }

    if (form) {
        const inputs = form.querySelectorAll('input');

        inputs.forEach(function(input) {
            input.addEventListener('focus', function() {
                if (!fieldsInteracted.has(this.id)) {
                    fieldsInteracted.add(this.id);
                }
            });

            input.addEventListener('input', function() {
                if (!fieldsInteracted.has(this.id)) {
                    fieldsInteracted.add(this.id);
                }
                validateField(this);
                
                switch(this.id) {
                    case 'nom':
                        transformNom(this);
                        break;
                    case 'prenom':
                        transformPrenom(this);
                        break;
                    case 'dateNaissance':
                        formatDateNaissance(this);
                        break;
                    case 'email':
                        validateEmail(this);
                        break;
                    case 'codeConfidentiel':
                        validateCodeConfidentiel(this);
                        break;
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Marquer tous les champs comme interagis lors de la soumission
            inputs.forEach(input => fieldsInteracted.add(input.id));
            
            // Valider tous les champs
            inputs.forEach(validateField);
            
            if (errors.size === 0) {
                document.getElementById('modalMessage1').textContent = 'Vos données sont valides, elles vont être transmises sur nos serveurs pour traitement.';
                document.getElementById('modalMessage2').textContent = 'Nous sommes ravis de vous compter parmi nos nouveaux clients';
                modal.show();

                document.getElementById('infoModal').addEventListener('hidden.bs.modal', function () {
                    form.submit();
                }, { once: true });
            }
        });

        if (resetButton) {
            resetButton.addEventListener('click', resetForm);

        }
    }
    
});