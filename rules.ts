import fs from "node:fs";
import type { KarabinerRules, KeyCode } from "./types";
import {
	type LayerCommand,
	app,
	createHyperSubLayers,
	createLayer,
	open,
	quit,
	rectangle,
	shell,
	shortcut,
} from "./utils";

const hjklToArrowKeys: Partial<Record<KeyCode, LayerCommand>> = {
	h: {
		description: "hjkl to arrow keys",
		to: [{ key_code: "left_arrow" }],
	},
	j: {
		description: "hjkl to arrow keys",
		to: [{ key_code: "down_arrow" }],
	},
	k: {
		description: "hjkl to arrow keys",
		to: [{ key_code: "up_arrow" }],
	},
	l: {
		description: "hjkl to arrow keys",
		to: [{ key_code: "right_arrow" }],
	},
	semicolon: {
		description: "hjkl to arrow keys",
		to: [{ key_code: "delete_or_backspace" }],
	},
};

const rules: KarabinerRules[] = [
	...createLayer("right_command", hjklToArrowKeys),
	// Define the Hyper key itself
	{
		description: "Hyper Key (⌃⌥⇧⌘)",
		manipulators: [
			{
				description: "Caps Lock -> Hyper Key",
				from: {
					key_code: "caps_lock",
					modifiers: {
						optional: ["any"],
					},
				},
				to: [
					{
						set_variable: {
							name: "hyper",
							value: 1,
						},
					},
				],
				to_after_key_up: [
					{
						set_variable: {
							name: "hyper",
							value: 0,
						},
					},
				],
				to_if_alone: [
					{
						key_code: "escape",
					},
				],
				type: "basic",
			},
			//      {
			//        type: "basic",
			//        description: "Disable CMD + Tab to force Hyper Key usage",
			//        from: {
			//          key_code: "tab",
			//          modifiers: {
			//            mandatory: ["left_command"],
			//          },
			//        },
			//        to: [
			//          {
			//            key_code: "tab",
			//          },
			//        ],
			//      },
		],
	},
	...createHyperSubLayers({
		...hjklToArrowKeys,
		f7: {
			description: "Toggle Caps Lock",
			to: [{ key_code: "caps_lock" }],
		},
		spacebar: open(
			"raycast://extensions/stellate/mxstbr-commands/create-notion-todo",
		),
		// b = "B"rowse
		b: {
			t: open("https://twitter.com"),
			y: open("https://youtube.com"),
		},
		// o = "Open" applications
		o: {
			1: app("1Password"),
			a: app("Arc"),
			c: app("Notion Calendar"), // Calendar
			d: app("Discord"),
			e: app("Spark Desktop"), // Email
			f: app("Finder"),
			h: app("Things3"), // tHings
			m: app("Spotify"), // Music
			n: app("Notion"),
			s: app("Slack"),
			t: app("Telegram"),
			v: app("Visual Studio Code"), // Vscode
			z: app("Zed"), // Zed
			k: app("Kitty"),
			w: app("Warp"),
		},
		p: {
			1: quit("1Password"),
			a: quit("Arc"),
			c: quit("Notion Calendar"), // Calendar
			d: quit("Discord"),
			e: quit("Spark Desktop"), // Email
			f: quit("Finder"),
			h: quit("Things3"), // tHings
			m: quit("Spotify"), // Music
			n: quit("Notion"),
			s: quit("Slack"),
			t: quit("Telegram"),
			v: quit("Visual Studio Code"), // Vscode
			w: quit("Warp"),
			z: quit("Zed"), // Zed
			k: quit("Kitty"),
		},

		// TODO: This doesn't quite work yet.
		// l = "Layouts" via Raycast's custom window management
		// l: {
		//   // Coding layout
		//   c: shell`
		//     open -a "Visual Studio Code.app"
		//     sleep 0.2
		//     open -g "raycast://customWindowManagementCommand?position=topLeft&relativeWidth=0.5"

		//     open -a "Terminal.app"
		//     sleep 0.2
		//     open -g "raycast://customWindowManagementCommand?position=topRight&relativeWidth=0.5"
		//   `,
		// },

		// w = "Window" via rectangle.app
		w: {
			semicolon: {
				description: "Window: Hide",
				to: [
					{
						key_code: "h",
						modifiers: ["right_command"],
					},
				],
			},
			y: rectangle("previous-display"),
			o: rectangle("next-display"),
			k: rectangle("top-half"),
			j: rectangle("bottom-half"),
			h: rectangle("left-half"),
			l: rectangle("right-half"),
			f: rectangle("maximize"),
			u: {
				description: "Window: Previous Tab",
				to: [
					{
						key_code: "tab",
						modifiers: ["right_control", "right_shift"],
					},
				],
			},
			i: {
				description: "Window: Next Tab",
				to: [
					{
						key_code: "tab",
						modifiers: ["right_control"],
					},
				],
			},
			n: {
				description: "Window: Next Window",
				to: [
					{
						key_code: "grave_accent_and_tilde",
						modifiers: ["right_command"],
					},
				],
			},
			b: {
				description: "Window: Back",
				to: [
					{
						key_code: "open_bracket",
						modifiers: ["right_command"],
					},
				],
			},
			// Note: No literal connection. Both f and n are already taken.
			m: {
				description: "Window: Forward",
				to: [
					{
						key_code: "close_bracket",
						modifiers: ["right_command"],
					},
				],
			},
		},

		// s = "System"
		s: {
			u: {
				to: [
					{
						key_code: "volume_increment",
					},
				],
			},
			j: {
				to: [
					{
						key_code: "volume_decrement",
					},
				],
			},
			i: {
				to: [
					{
						key_code: "display_brightness_increment",
					},
				],
			},
			k: {
				to: [
					{
						key_code: "display_brightness_decrement",
					},
				],
			},
			l: {
				to: [
					{
						key_code: "q",
						modifiers: ["right_control", "right_command"],
					},
				],
			},
			p: {
				to: [{ key_code: "play_or_pause" }],
			},
			semicolon: {
				to: [{ key_code: "fastforward" }],
			},
		},

		// r = "Raycast"
		r: {
			c: open("raycast://extensions/thomas/color-picker/pick-color"),
			n: open("raycast://script-commands/dismiss-notifications"),
			l: open(
				"raycast://extensions/stellate/mxstbr-commands/create-mxs-is-shortlink",
			),
			e: open(
				"raycast://extensions/raycast/emoji-symbols/search-emoji-symbols",
			),
			p: open("raycast://extensions/raycast/raycast/confetti"),
			a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
			s: open("raycast://extensions/peduarte/silent-mention/index"),
			h: open(
				"raycast://extensions/raycast/clipboard-history/clipboard-history",
			),
			1: open(
				"raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1",
			),
			2: open(
				"raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2",
			),
		},
	}),
	{
		description: "Change Backspace to Spacebar when Minecraft is focused",
		manipulators: [
			{
				type: "basic",
				from: {
					key_code: "delete_or_backspace",
				},
				to: [
					{
						key_code: "spacebar",
					},
				],
				conditions: [
					{
						type: "frontmost_application_if",
						file_paths: [
							"^/Users/mxstbr/Library/Application Support/minecraft/runtime/java-runtime-gamma/mac-os-arm64/java-runtime-gamma/jre.bundle/Contents/Home/bin/java$",
						],
					},
				],
			},
		],
	},
];

fs.writeFileSync(
	"karabiner.json",
	JSON.stringify(
		{
			global: {
				show_in_menu_bar: false,
			},
			profiles: [
				{
					name: "Default",
					complex_modifications: {
						rules,
					},
				},
			],
		},
		null,
		2,
	),
);
