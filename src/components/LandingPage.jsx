import React from 'react'

window.addEventListener('scroll', () => {
  document.querySelectorAll("section").forEach( section => {
  const rect = section.getBoundingClientRect();
  if( rect.top < window.innerHeight ){
    section.classList.add('active');
  }else {
    section.classList.remove('active');
  }
})})

class LandingPage extends React.Component{



  render(){

	return(

		<div>

			<section id="carousel">
				<div id="carousel-text">
					<h1>The Geo-Assassins</h1>
					<h2>Learn More <sub>﹀</sub></h2>
				</div>
				<img class="carousel-image visible" src="images/imagebg.jpeg" />

			</section>

			<section id="about">
				<h2>About</h2>
				<div class="col-lg-7 col-md-6 col-sm-12">
					<p>
        The Flyest Game since Super Smash,
        Play With your friends as you pick and track your targets trying to be the best Assassin of them all. Using a third party app configured to be install smoothly when you first sign up, see your targets and fellow assassin's location in real-time even if the browser is closed! Running as a progressive web app, joining in on the fun is as easy as clicking a link. Join the hunt today!
					</p>
				</div>
				<div id="aboutmockup" class="col-lg-5 col-md-6 col-sm-12">
					<img src="images/Assasin_1.png" alt="App mockup" />
				</div>

			</section>


			<section id="staff">
				<h2>Staff:</h2>
				<div class="row">
					<div class="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i class="em em-angry headshot"></i>
						<h4 class="staff-name">Anton Laudeuer</h4>
						<p class="staff-bio"> EDWARDSSS WHERE YOU GOING
						</p>
					</div>
					<div class="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i class="em em-smile headshot"></i>
						<h4 class="staff-name">Denis Gao</h4>
						<p class="staff-bio">OOOooripen
						</p>
					</div>
					<div class="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i class="em em-blush headshot"></i>
						<h4 class="staff-name">Leslie Chiu</h4>
						<p class="staff-bio">CLAMP THOSE CHEEKS
						</p>
					</div>

					<div class="col-lg-3 col-md-6 col-sm-12 staff-profile">
						<i class="em em-confused headshot"></i>
						<h4 class="staff-name">Michael Yang</h4>
						<p class="staff-bio"> 我 喝 醉 了
						</p>
					</div>
				</div>
      </section>
      <section >
          <button className = "Login"> CLICK TO PLAY </button>
      </section>

		</div>
	)}

}

export default LandingPage
