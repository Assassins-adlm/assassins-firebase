import React from 'react'
import { Link } from 'react-router-dom'




	//Layout Thrashing/////////?????
	// const sections = Array.from(document.querySelectorAll('section'));
	// const rects = sections.map(section => section.getBoundingClientRect());
	// for (let i = 0; i < sections.length; i++) {

	// 	const section = sections[i];
	// 	const rect = rects[i];

	// 	if (rect<(section*3)) {
	// 		section.classList.add('active');
	// 	} else {
	// 		section.classList.remove('active');
	// 	}
	// }

class LandingPage extends React.Component{

	componentDidMount() {
		window.addEventListener('scroll', () => {
			const scrollPosition = window.scrollY
		document.querySelectorAll("section").forEach( section => {
		if(scrollPosition>300&&scrollPosition<1200){
			section.classList.add('active');
		} else{
			section.classList.remove('active');
		}
		})})
		//Paralaxing ///////////??????
		const carouselImages = document.querySelectorAll(".carousel-image");
		window.addEventListener('scroll', function(){
			const scrollPosition = window.scrollY
			console.log(scrollPosition, "!!!!")
			console.log(carouselImages)
			carouselImages.forEach( image => {
				console.log(image)
				image.style.transform = `translateY(${scrollPosition/3}px)`;
			})
		})

	}


  render(){

	return(

		<div>

			<section id="carousel">
				<div id="carousel-text">
					<h1>The Geo-Assassins</h1>
					<h2>Learn More <sub>﹀</sub></h2>
				</div>
				<img className="carousel-image visible" src="images/imagebg.jpeg" />
			</section>

			<section id="about">
				<h2>About</h2>
				<div className="col-lg-7 col-md-6 col-sm-12">
					<p>
        The Flyest Game since Super Smash,
        Play With your friends as you pick and track your targets trying to be the best Assassin of them all. Using a third party app configured to be install smoothly when you first sign up, see your targets and fellow assassin's location in real-time even if the browser is closed! Running as a progressive web app; joining in on the fun is as easy as clicking a link. Join the hunt today!
					</p>
				</div>
				<div id="aboutmockup" className="col-lg-5 col-md-6 col-sm-12">
					<img src="images/Assasin_1.png" alt="App mockup" />
				</div>

			</section>


			<section id="staff">
				<h2>Staff:</h2>
				<div className="row">
					<div className="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i className="em em-angry headshot"></i>
						<h4 className="staff-name">Anton Laudeuer</h4>
						<p className="staff-bio"> EDWARDSSS WHERE YOU nGOING
						</p>
					</div>
					<div className="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i className="em em-smile headshot"></i>
						<h4 className="staff-name">Denis Gao</h4>
						<p className="staff-bio">OOOooripen
						</p>
					</div>
					<div className="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i className="em em-blush headshot"></i>
						<h4 className="staff-name">Leslie Chiu</h4>
						<p className="staff-bio">CLAMP THOSE CHEEKS
						</p>
					</div>

					<div className="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i className="em em-confused headshot"></i>
						<h4 className="staff-name">Michael Yang</h4>
						<p className="staff-bio"> 我 喝 醉 了
						</p>
					</div>
				</div>
      </section>
      <section >
          <Link to="/home"> <button className = "Login"> CLICK TO PLAY </button></Link>
      </section>
		</div>
	)}

}

export default LandingPage
