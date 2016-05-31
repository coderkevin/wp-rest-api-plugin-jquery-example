
jQuery( function( $ ) {

	var g_users = {};
	var g_posts = [];

	// Regenerates the table based on the current globals.
	var regenerateTable = function() {
		var newTable = generateTable( g_posts, g_users );
		$( '#post-table' ).replaceWith( newTable );
	}

	// Creates a new table to display post results.
	var generateTable = function( posts, users ) {
		var i18n = screen_data.i18n;

		// Get all of the authors for the posts we're showing.
		var authorIds = posts.map( function( post ) { return post.author.toString(); } );
		fetchUsers( authorIds, users );

		// Create the table and headers.
		var table = $( '<table/>', { 'id': 'post-table', 'class': 'search' } );
		var headerRow = $( '<tr/>' ).appendTo( table );
		$( '<th/>', { text: i18n.post } ).appendTo( headerRow );
		$( '<th/>', { text: i18n.author } ).appendTo( headerRow );

		// For each post, create a row.
		posts.filter( function( post ) {
			var row = $( '<tr/>' ).appendTo( table );

			// Post Title
			var titleCell = $( '<td/>' ).appendTo( row );
			$( '<a/>', {
				'href': post.link,
				text: post.title.rendered
			} ).appendTo( titleCell );

			// Post Author
			var author = users[ post.author.toString() ];
			var authorCell = $( '<td/>' ).appendTo( row );
			$( '<a/>', {
				'href': author.link,
				text: author.name
			} ).appendTo( authorCell );
		} );

		return table;
	}

	// Returns the ids which aren't in the users list.
	var filterUnfetchedUsers = function( ids, users ) {
		var unfetched = [];

		for ( var i in ids ) {
			var id = ids[ i ];
			if ( unfetched.indexOf( id ) == -1 &&
					 ! users.hasOwnProperty( id ) ) {
				unfetched.push( id );
			}
		}

		return unfetched;
	}

	// Fetches the users which aren't in the users list, then adds them to it.
	var fetchUsers = function( ids, users ) {
		var unfetchedUsers = filterUnfetchedUsers( ids, users );

		if ( unfetchedUsers.length === 0 ) {
			// Nothing to do.
			return;
		}

		// Set default values while we fetch.
		unfetchedUsers.filter( function( id ) {
			users[ id ] = {
				name: '?',
				link: '#'
			}
		} );

		// Fetch those unfetched users.
		var apiString = 'wp/v2/users?' +
			              'include=' + unfetchedUsers.toString() +
										'per_page=' + unfetchedUsers.length;
		$.ajax( {
			url: screen_data.api_root + apiString,
			success: function( data ) {
				data.filter( function( user ) {
					users[ user.id ] = user;
				} );

				regenerateTable();
			},
			error: function( req ) {
				console.error( 'error on users request' );
				console.error( req );
			},
			cache: false
		} );
	}

	$( document ).ready( function() {
		regenerateTable();

		$.ajax( {
			url: screen_data.api_root + 'wp/v2/posts',
			success: function( data ) {
				g_posts = data;
				regenerateTable();
			},
			error: function( req ) {
				console.error( 'error on request' );
				console.error( req );
			},
			cache: false
		} );
	} );

} );


