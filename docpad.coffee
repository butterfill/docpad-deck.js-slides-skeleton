# The DocPad Configuration File
# It is simply a CoffeeScript Object which is parsed by CSON
docpadConfig = {

#http://docpad.org/docs/troubleshoot#watching-doesn-t-work-works-only-some-of-the-time-or-i-get-eisdir-errors
watchOptions: preferredMethods: ['watchFile','watch']

plugins:
  #this avoids problems with svg which require text elements!
  text:
    matchElementRegexString: 't'
  # either this or syntax below (newer seems to require this)
  raw:
    raw:
      # rsync
      # -r recursive
      # -u skip file if the destination file is newer
      # -l copy any links over as well
      command: ['rsync', '-rul', 'src/raw/', 'out/' ]
  #
  # raw:
  #   commands:
  #     # rsync
  #     # -r recursive
  #     # -u skip file if the destination file is newer
  #     # -l copy any links over as well
  #     raw  : ['rsync', '-rul', 'src/raw/', 'out/' ]


	#renderPasses : 1

	# =================================
	# Template Data
	# These are variables that will be accessible via our templates
	# To access one of these within our templates, refer to the FAQ: https://github.com/bevry/docpad/wiki/FAQ

	templateData:

		# Specify some site properties
		site:
			# The production url of our website
			url: "http://butterfill.com"

			# The default title of our website
			title: "A Talk"

			# The website description (for SEO)
			description: """
				Slides for a lecture by s.butterfill@warwick.ac.uk
				"""

			# The website keywords (for SEO) separated by commas
			keywords: """
				philosophy, psychology, development, action, joint action, mindreading, motor representation, thought
				"""


		# -----------------------------
		# Helper Functions

		# Get the prepared site/document title
		# Often we would like to specify particular formatting to our page's title
		# we can apply that formatting here
		getPreparedTitle: ->
			# if we have a document title, then we should use that and suffix the site's title onto it
			if @document.title
				"#{@document.title} | #{@site.title}"
			# if our document does not have it's own title, then we should just use the site's title
			else
				@site.title

		# Get the prepared site/document description
		getPreparedDescription: ->
			# if we have a document description, then we should use that, otherwise use the site's description
			@document.description or @site.description

		# Get the prepared site/document keywords
		getPreparedKeywords: ->
			# Merge the document keywords with the site keywords
			@site.keywords.concat(@document.keywords or []).join(', ')
			
}

# Export our DocPad Configuration
module.exports = docpadConfig