export const globalPath = {
	pathFavicon : "/src/assets/favicon",
	pathImg     : "/src/assets/img",
	pathSvg     : "/src/assets/svg",
};

export const ROLE_ADMIN  = "Admin";
export const ROLE_LEADER = "Leader";
export const ROLE_MEMBER = "Member";

export const LIST_ROLE_NAME = {
	[ROLE_ADMIN]  : "Quản trị viên",
	[ROLE_LEADER] : "Trưởng nhóm",
	[ROLE_MEMBER] : "Thành viên"
}

export const optionListRoles = [
	{
		value : ROLE_ADMIN,
		label : "Quản trị viên",
	},
	{
		value : ROLE_LEADER,
		label : "Nhóm trưởng",
	},
	{
		value : ROLE_MEMBER,
		label : "Thành viên",
	}
]

export const TYPE_BOARD_OPTIONS            = [
	{
		label : "Riêng tư",
		value : "private",
	},
	{
		label : "Công khai",
		value : "public",
	}
]
export const ACCESS_TOKEN_LOCALSTORAGE     = "access_token";
export const TYPE_TREELO_WEB_MEMBER        = "TREELO_WEB_MEMBER";
export const SERVICE           = "TREELO_WEB";
export const ACTION_USER_ACCEPT_JOIN_BOARD = "ACTION_USER_ACCEPT_JOIN_BOARD"

export const STATUS_ACCEPTED = 1;
export const STATUS_ACTIVE = 1;