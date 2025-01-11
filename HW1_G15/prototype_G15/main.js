// טוען את קובץ המשתמשים
async function loadUsers() {
    const response = await fetch("./users.json"); // טוען את הקובץ users.json
    const users = await response.json(); // ממיר את המידע ממחרוזת לאובייקטים
    return users;
}

// מבצע אימות נתוני משתמש
async function login(email, password) {
    const users = await loadUsers(); // טוען את המשתמשים מקובץ ה-JSON
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
        // שמירת המייל והשמות ב-localStorage
        localStorage.setItem('userName', user.name);
        localStorage.setItem('userEmail', user.email);
        alert("Login successful!"); // במידה והנתונים נכונים
        window.location.href = "account.html"; // מעביר לעמוד ה"חשבון שלי"
    } else {
        alert("Invalid email or password!"); // במידה והנתונים שגויים
    }
}

// מחבר את הטופס לפונקציית הכניסה
document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); // מונע את התנהגות ברירת המחדל של הטופס
    const email = document.querySelector("#email").value; // שולף את האימייל מהטופס
    const password = document.querySelector("#password").value; // שולף את הסיסמה מהטופס

    login(email, password); // מפעיל את פונקציית הכניסה
});
