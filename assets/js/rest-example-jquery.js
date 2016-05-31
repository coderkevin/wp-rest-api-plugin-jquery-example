
jQuery( function( $ ) {

	var g_users = {};
	var g_posts = [];
	var g_searchTimeout = null;

	// Updates the search box message.
	var updateMessage = function( text ) {
		$( '#search-message' ).text( text );
	};

	// Regenerates the table based on the current globals.
	var regenerateTable = function() {
		var newTable = generateTable( g_posts, g_users );
		$( '#post-table' ).replaceWith( newTable );
	};

	// Regenerates a single updated post.
	var regeneratePost = function( updatedPost ) {
		g_posts.filter( function( post ) {
			if ( post.id === updatedPost.id ) {
				var index = g_posts.indexOf( post );
				g_posts[ index ] = updatedPost;
			}
		} );

		var row = generatePostRow( updatedPost, g_users );
		$( 'tr[key="' + updatedPost.id + '"]' ).replaceWith( row );
	};

	// Creates a new table to display post results.
	var generateTable = function( posts, users ) {
		var i18n = screen_data.i18n;

		// Get all of the authors for the posts we're showing.
		var authorIds = posts.map( function( post ) { return post.author.toString(); } );
		fetchUsers( authorIds, users );

		// Create the table and headers.
		var table = $( '<table/>', { 'id': 'post-table' } );
		var headerRow = $( '<tr/>' ).appendTo( table );
		$( '<th/>', { text: i18n.post } ).appendTo( headerRow );
		$( '<th/>', { text: i18n.author } ).appendTo( headerRow );
		$( '<th/>', { text: i18n.sticky } ).appendTo( headerRow );

		// For each post, create a row.
		posts.filter( function( post ) {
			var row = generatePostRow( post, users );
			row.appendTo( table );
		} );

		return table;
	};

	// Creates a new TR element for a post.
	var generatePostRow = function( post, users ) {
		var row = $( '<tr/>', { 'key': post.id } );

		// Post Title
		var titleCell = $( '<td/>' ).appendTo( row );
		$( '<a/>', {
			'href': post.link,
			html: post.title.rendered
		} ).appendTo( titleCell );

		// Post Author
		var author = users[ post.author.toString() ];
		var authorCell = $( '<td/>' ).appendTo( row );
		$( '<a/>', {
			'href': author.link,
			html: author.name
		} ).appendTo( authorCell );

		// Sticky
		var stickyCell = $( '<td/>' ).appendTo( row );
		var stickyInput = $( '<input/>', {
			'type': 'checkbox',
		} ).appendTo( stickyCell );
		stickyInput.prop( 'checked', post.sticky );

		stickyInput.on( 'change', function( evt ) {
			stickyInput.prop( 'disabled', true );
			var props = {
				title: post.title.rendered + '.', // NOTE: Testing purposes only! Remove after done.
				sticky: (! post.sticky)
			};
			updatePost( post, props );
		} );

		return row;
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
	};

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
			};
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
	};

	var updatePost = function( post, props ) {

		$.ajax( {
			url: screen_data.api_root + 'wp/v2/posts/' + post.id,
			method: 'POST',
			beforeSend: function( req ) {
				req.setRequestHeader( 'X-WP-Nonce', screen_data.api_nonce );
				req.setRequestHeader( 'Accept', 'application/json' );

				// NOTE: If Content-Type is set to this on 2.0-beta13.1, updates don't work.
				//       However, for both master and development branches it's required because
				//       you get an error if you send form data.
				//req.setRequestHeader( 'Content-Type', 'application/json' );
			},
			data: props,
			success: function( data ) {
				// Update the global state
				regeneratePost( data );
			},
			error: function( req ) {
				console.error( 'error on sticky update' );
				console.error( req );
				// Reset the post to its previous state.
				regeneratePost( post );
			}
		} );
	};

	// Clears the search timeout.
	var clearTimeout = function() {
		if ( g_searchTimeout ) {
			window.clearTimeout( g_searchTimeout );
			g_searchTimeout = null;
		}
	};

	// Sends an API call to search for posts.
	var searchPosts = function() {
		updateMessage( screen_data.i18n.loading );

		var text = $( '#search-box' ).val();
		var apiString = 'wp/v2/posts?' +
			              'search=' + encodeURIComponent( text );

		$.ajax( {
			url: screen_data.api_root + apiString,
			success: function( data ) {
				g_posts = data;
				regenerateTable();
			},
			error: function( req ) {
				console.error( 'error on request' );
				console.error( req );
			},
			complete: function() {
				updateMessage( '' );
			},
			cache: false
		} );
	};

	// Automatically search for what's in the text box
	// if it sits for long enough.
	$( '#search-box' ).on( 'input', function( evt ) {
		clearTimeout();

		g_searchTimeout = window.setTimeout( function() {
			searchPosts();
			g_searchTimeout = null;
		}, 500 );
	} );

	// Immediately search when the form is submitted (i.e. <ENTER> key )
	$( '#search-form' ).on( 'submit', function( evt ) {
		evt.preventDefault();
		clearTimeout();
		searchPosts();
	} );

} );


