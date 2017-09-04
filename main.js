var imageplaceholder = 'https://www.axure.com/c/attachments/forum/7-0-general-discussion/3919d1401387174-turn-placeholder-widget-into-image-maintain-interactions-screen-shot-2014-05-29-10.46.57-am.png'
var __movies = []
function searchClicked(){
	var textInput = document.querySelector('.searchbar input')
	var url = 'http://api.tvmaze.com/search/shows?q='+ textInput.value
	axios.get(url).then(function(result){
		__movies = result.data.map(function(item, index){ 
			item.show.indexInStorage = index
			return item.show 
		})
		if(__movies.length == 0) return alert('No result found');
		textInput.value = '';
		loadContent()
	})
	.catch(function(err){
		alert(err.message)
	})
}

function loadContent(movies){
	var contentSelector = document.querySelector("#content")
	var contentHTML = ""
	__movies.forEach(function(movie){
		var element = 
		'<div class="movie-item" onclick="showmodal('+movie.indexInStorage+')">'
			+'<div>'+
				'<h3>'+movie.name+'</h3>'+
				'<img src="'+(movie.image&&movie.image.original || imageplaceholder)+'">'
			+'</div>'+
		'</div>';


		contentHTML += element
	})
	contentSelector.innerHTML = contentHTML
}

function showmodal(index){
	var data = __movies[index]
	var castUrl = 'http://api.tvmaze.com/shows/'+data.id+'/cast'

	axios.get(castUrl).then(function(result){
		data.cast = result.data
		putContentInModal(data)
	}).catch(function(err){
		putContentInModal(data)
	})

	
}

function putContentInModal(data){
	var modalSelector =document.querySelector('#modal')
	modalSelector.style.visibility = 'visible'
	var contentHTML = 
		'<div class="modalcontent" >'+
			'<h1 onclick="closeModal()" >Click Here To Close</h1>'+
			'<h3>'+data.name+'</h3>'+
			'<div>'+
				'<img src="'+(data.image&&data.image.original || imageplaceholder)+'">'+
				'<a href="'+data.url+'">Link</a>'+
			'<div>'+
			'<h2> Ratings: '+data.rating.average+'</h2>'+
			'<h2> Generes: '+(data.genres&&data.genres.join(' ') || 'N/A')+'</h2>'+
			data.summary+
			'<h3>cast</h3>'+
			'<div class="cast-container">'+
				formatCast(data.cast)+
			'<div>'+
				

		'</div>'

	modalSelector.innerHTML = contentHTML
}

function formatCast(cast){
	if(!cast) return '';
	
	var contentHTML = ""
	cast.forEach(function(person){
		var personImage = person.person.image
		var personHTML =  

			'<div class="person">'+
				'<img src="'+(personImage&&personImage.original || '') +'" alt="'+(personImage&&personImage.medium || '')+'"/>'+
				'<p>'+person.person.name+'</p>'+
				'<p>As</p>'+
				'<p>'+person.character.name+'</p>'+
			'</div>'
		contentHTML += personHTML
	})

	return contentHTML
}

function closeModal(){
	var modalSelector =document.querySelector('#modal')
	modalSelector.innerHTML = "";
	modalSelector.style.visibility = 'hidden'
}

