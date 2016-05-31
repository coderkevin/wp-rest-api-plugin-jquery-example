
jQuery( function( $ ) {

	var generateTable = function( data ) {
		var table = $( '<table/>', { 'class': 'search' } );
		var headerRow = $( '<tr/>' ).appendTo( table );
		$( '<th/>', { text: 'Post' } ).appendTo( headerRow );
		$( '<th/>', { text: 'Author' } ).appendTo( headerRow );

		data.filter( function( post ) {
			var row = $( '<tr/>' ).appendTo( table );

			var titleCell = $( '<td/>' ).appendTo( row );
			$( '<a/>', {
				'href': post.link,
				text: post.title.rendered
			} ).appendTo( titleCell );

			var authorCell = $( '<td/>', { text: '?' } ).appendTo( row );
		} );

		table.appendTo( '#example-post-list' );
	}

	$( document ).ready( function() {
		$.ajax( {
			url: screen_data.api_root + 'wp/v2/posts',
			success: function( data ) {
				console.log( 'data' );
				console.log( data );
				generateTable( data );
			},
			error: function( req ) {
				console.log( 'error on request' );
				console.log( req );
			},
			cache: false
		} );
	} );

} );


