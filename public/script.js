let profile = document.body.querySelector(".profile");
let aside = document.body.querySelector("#aside")

profile.addEventListener('click', () => {
    aside.classList.toggle('open');
})

document.addEventListener('click', (e) => {
    if (
        aside.classList.contains('open') &&
        !aside.contains(e.target) &&
        !hamburger.contains(e.target)
    ) {
        aside.classList.remove('open');
    }
});