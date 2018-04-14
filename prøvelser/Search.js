import React from 'react';


class Search extends React.Component {
	render(){
		return(
			<div>
				<h1>Brukersøk</h1>
				<input type="text" placheolder="navn, epost, by, etc." />
				<button>Søk</button>
			</div>
		);
	}
}

export default Search
