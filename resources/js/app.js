import '../css/app.css'
import Lottie from 'lottie-web'

const lotties = document.querySelectorAll('[lottie]')
lotties.forEach(lottieContainer => {
    Lottie.loadAnimation({
        container: lottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: "lottie/" + lottieContainer.getAttribute('lottie') + ".json"
    });
})
