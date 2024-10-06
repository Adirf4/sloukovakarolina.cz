const images = ['foto1.jpg', 'foto2.jpg', 'foto3.jpg'];
let currentIndex = 0;
const imageElement = document.getElementById('changingImage');

// Funkce pro změnu fotky
function changeImage() {
    currentIndex = (currentIndex + 1) % images.length;
    imageElement.
    src = images[currentIndex];
}

// Nastavení intervalu 20 vteřin
setInterval(changeImage, 20000);

function toggleDropdown() {
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
}

document.addEventListener('DOMContentLoaded', function () {
    const calendar = document.getElementById('calendar');
    const modal = document.getElementById('modal');
    const closeModal = document.querySelector('.close');
    const reservationForm = document.getElementById('reservationForm');
    const selectedSlotInput = document.getElementById('selectedSlot');
    let slots = generateSlots();

    // Vytvoření časových slotů
    function generateSlots() {
        const days = ['28.10', '29.10', '30.10', '31.10', '1.11', '2.11', '3.11', '4.11', '5.11'];
        const slots = [];

        days.forEach(day => {
            let time = 8 * 60; // 8:00
            while (time < 16 * 60 + 40) {
                const hours = Math.floor(time / 60);
                const minutes = time % 60;
                const formattedTime = `${day} ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
                
                if (hours === 13 && minutes === 20) { // Obědová pauza
                    time += 40;
                } else {
                    slots.push({
                        time: formattedTime,
                        booked: false
                    });
                    time += 40;
                }
            }
        });

        return slots;
    }

    // Zobrazení slotů
    function displaySlots() {
        calendar.innerHTML = '';
        slots.forEach((slot, index) => {
            const slotDiv = document.createElement('div');
            slotDiv.classList.add('slot');
            slotDiv.classList.add(slot.booked ? 'booked' : 'available');
            slotDiv.innerText = slot.time;

            if (!slot.booked) {
                slotDiv.addEventListener('click', function () {
                    selectedSlotInput.value = slot.time;
                    modal.style.display = 'block';
                });
            }

            calendar.appendChild(slotDiv);
        });
    }

    displaySlots();

    closeModal.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    // Odeslání rezervace
    reservationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const selectedSlot = selectedSlotInput.value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;

        // Nastavení rezervovaného slotu
        slots = slots.map(slot => {
            if (slot.time === selectedSlot) {
                return { ...slot, booked: true };
            }
            return slot;
        });

        displaySlots();
        modal.style.display = 'none';

        emailjs.init('RmHr3UOrQbc_swwyF');

        // Odeslání emailu pomocí EmailJS
        emailjs.send('service_55tudyc', 'template_vdp1h6b', {
            name: name,
            email: email,
            phone: phone,
            slot: selectedSlot
        }).then(function (response) {
            alert('Rezervace úspěšná! Email odeslán.');
        }, function (error) {
            alert('Nastala chyba při odesílání emailu.');
        });
    });
});