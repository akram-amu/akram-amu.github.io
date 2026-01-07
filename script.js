// Simple script to change background color on click
const btn = document.getElementById('colorBtn');

btn.addEventListener('click', () => {
    document.body.style.backgroundColor = 
        document.body.style.backgroundColor === 'black' ? '#f4f4f9' : 'black';
});
