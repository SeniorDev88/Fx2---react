import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';



/*
 * STYLE
 */
import './App.css';



import F2xModal from './modal/F2xModal';
import F2xVideoPlayer from './videoplayer/F2xVideoPlayer';


import F2xHeader from './header/F2xHeader';


import F2xHome from './home/F2xHome';
import F2xJoin from './join/F2xJoin';
import F2xSignIn from './signin/F2xSignIn';
import F2xPaypalSign from './paypalsign/F2xPaypalSign';

import F2xExercise from './exercise/F2xExercise';
import F2xWorkout from './workout/F2xWorkout';
import F2xMyWorkout from './my_workout/F2xMyWorkout';
import F2xAccount from './account/F2xAccount';
import F2xView from './view/F2xView';

import F2xTerms from './terms/F2xTerms';
import F2xPolicy from './policy/F2xPolicy';
import F2xContact from './contact/F2xContact';
import F2xFAQ from './faq/F2xFAQ';


import F2xSettings from './settings/F2xSettings';


import F2xMail from './_mails/';




import './App.css';





let dropdownOpen = false;


export const closeElements = () => {
	if(dropdownOpen){
		dropdownOpen.style.display = 'none';
		dropdownOpen = false;
	}
}

export const setOpenDropdown = (ref) => {
	if(ref !== dropdownOpen)
		closeElements();
		
	dropdownOpen = ref;
}

window.addEventListener('mouseup', function(){
	closeElements();
})



const isMobile = () => {
    return (
    	(navigator.userAgent.match(/Android/i)) ||
		(navigator.userAgent.match(/iPhone/i))
    );
}

if(!isMobile())
	document.body.style.minHeight = (innerHeight - 52) +'px'


const F2xMain = (props) => (
	<div >
		{props.children}
	</div>
);

const F2xLayout = (props) => (
	<div className="App">
		<F2xVideoPlayer />	
		<F2xModal />
		<F2xHeader />
		
		<div className="f2x-content">
			{props.children}
		</div>
	</div>
);	


const App = () => (
	<Router history={browserHistory} >
		<Route path="/" component={F2xLayout} >
			<Route component={F2xMain}>
				<IndexRoute component={F2xHome} />
				
				<Route path="exercise(/:pathParam)" component={F2xExercise} />
				<Route path="workout" component={F2xWorkout} />
				<Route path="myworkout(/:pathParam)" component={F2xMyWorkout} />
				<Route path="account(/:pathParam)" component={F2xAccount} />
				<Route path="view(/:pathParam)" component={F2xView} />
				<Route path="invite(/:pathParam)" component={F2xHome} />
				
				<Route path="terms" component={F2xTerms} />
				<Route path="policy" component={F2xPolicy} />
				<Route path="contact" component={F2xContact} />
				<Route path="faq" component={F2xFAQ} />
				
				<Route path="settings" component={F2xSettings} />
				
				<Route path="social/instagram/complete/signup(/:pathParam)" component={F2xHome} />
			</Route> 
		</Route>
		<Route path="/join-platinum" component={F2xJoin} />
		<Route path="/signin" component={F2xSignIn} />
		<Route path="/paypalsingin" component={F2xPaypalSign} />
		
		<Route path="/mail(/:pathParam)" component={F2xMail} />
	</Router>      
);

export default App;
