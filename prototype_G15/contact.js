// contact.js

// שליחה של טופס יצירת קשר
document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();  // מונע את שליחת הטופס המיידית

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // יצירת אובייקט עם הנתונים מהטופס
    const contactData = {
        name: name,
        email: email,
        message: message,
    };

    // שליחה לשרת (בהנחה שנו משתמשים ב־fetch כדי לשלוח את המידע לשרת)
    fetch('/submit-contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
    })
    .then(response => response.json())
    .then(data => {
        alert('Your message has been sent successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error sending your message.');
    });
});
