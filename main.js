function searchClicked(){
	var textInput = document.querySelector('.searchbar input')
	var url = 'http://api.tvmaze.com/search/shows?q='+ textInput.value
	axios.get(url).then(function(result){
		var movies = result.data.map(function(item, index){ 
			item.show.indexInStorage = index
			return item.show 
		})
		if(movies.length == 0) return alert('No result found');
		textInput.value = '';
		loadContent(movies)
	})
	.catch(function(err){
		alert(err.message)
	})
}

function loadContent(movies){
	console.log(movies)
	window.localStorage.pageCounter = 0
	window.localStorage.movies =JSON.stringify(movies)
	var contentSelector = document.querySelector("#content")
	var contentHTML = ""
	movies.forEach(function(movie){
		var element = 
		'<div class="movie-item">'
			+'<div>'+
				'<h3>'+movie.name+'</h3>'+
				'<img src="'+movie.image.original+'">'+
				'<button onclick="showmodal('+movie.indexInStorage+')">Show More</button>'
			+'</div>'+
		'</div>';


		contentHTML += element
	})
	contentSelector.innerHTML = contentHTML
}

function showmodal(index){
	var data = JSON.parse(window.localStorage.movies)[index]
	var modalSelector =document.querySelector('#modal')
	modalSelector.style.visibility = 'visible'
	var contentHTML = 
		'<div class="modalcontent" >'+
			'<h1 onclick="closeModal()" >Click Here To Close</h1>'+
			'<h3>'+data.name+'</h3>'+
			'<div>'+
				'<img src="'+data.image.original+'">'+
				'<a href="'+data.url+'">Link</a>'+
			'<div>'+
			'<h2> Ratings: '+data.rating.average+'</h2>'+
			data.summary+

		'</div>'

	modalSelector.innerHTML = contentHTML
}

function closeModal(){
	var modalSelector =document.querySelector('#modal')
	modalSelector.innerHTML = "";
	modalSelector.style.visibility = 'hidden'
}

