import fs from "node:fs";
import type { KarabinerRules, KeyCode } from "./types";
import {
	type LayerCommand,
	app,
	createHyperSubLayers,
	createLayer,
	mapObjectValues,
	open,
	quit,
	window,
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

const appOpenKeys = {
	1: "1Password",
	b: "Obsidian",
	c: "Notion Calendar",
	d: "Discord",
	e: "Spark Desktop",
	f: "Finder",
	g: "Ghostty",
	h: "Todoist",
	j: "Day One",
	m: "Spotify",
	n: "Notion",
	s: "Slack",
	t: "Telegram",
	v: "Cursor",
	w: "Zen Browser",
	z: "Zed",
	u: "Figma",
} as const

const rules: KarabinerRules[] = [
	...createLayer("right_command", hjklToArrowKeys),
	{
		description: "Right Command as delete on tap",
		manipulators: [
			{
				description: "right cmd -> backspace on click",
				from: {
					key_code: "right_command",
					modifiers: {
						optional: ["any"],
					},
				},
				to: [
					{
						key_code: "right_command",
					},
				],
				to_if_alone: [
					{
						key_code: "delete_or_backspace",
					},
				],
				type: "basic",
			},
		],
	},
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
		o: mapObjectValues(appOpenKeys, app),
		x: mapObjectValues(appOpenKeys, quit),

		// w = "Window"
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
			y: window("previous-display"),
			o: window("next-display"),
			k: window("top-half"),
			j: window("bottom-half"),
			h: window("left-half"),
			l: window("right-half"),
			f: window("maximize"),
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
