#ifndef SPRITESHEET_<%= name.toUpperCase() %>_H
#define SPRITESHEET_<%= name.toUpperCase() %>_H

namespace Graphics
{
	namespace SpriteSheets
	{
		struct Sprite
		{
			const char* FileName;
			uint16_t X;
			uint16_t Y;
			uint16_t W;
			uint16_t H;
		};

		namespace <%= name %>
		{
			enum {
				WIDTH = <%= props.width %>,
				HEIGHT = <%= props.height %>
			};

			extern const char* FILE_NAME;

			extern const Sprite SPRITES[<%= sprites.length %>];
		}
	}
}

#endif
