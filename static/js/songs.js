for (let result of document.querySelectorAll("#results div"))
{
    result.setAttribute('data-aos', 'fade-up');
}
AOS.init({
    duration: 1000,
    once: true
});