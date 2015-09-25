#include "template.h"

namespace Graphics
{
	namespace SpriteSheets
	{
		namespace <%= name %>
		{
			const char* FILE_NAME = "<%= fileName %>";
			
			const Sprite SPRITES[<%= sprites.length %>] = {
				<% sprites.forEach(function(sprite, idx) { %>
				{
					"<%= sprite.fileName %>",
					<%= sprite.x %>,
					<%= sprite.y %>,
					<%= sprite.w %>,
					<%= sprite.h %>
				}<%= idx < sprites.length - 1 ? ',' : '' %>
				<% }); %>
			};
		}
	}
}
