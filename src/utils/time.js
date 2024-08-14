export const dateToHMDDMonthYYYY = (timestamp) => {
	const date = new Date (timestamp);
	
	const hours   = date.getUTCHours ().toString ().padStart (2, '0');
	const minutes = date.getUTCMinutes ().toString ().padStart (2, '0');
	const day     = date.getUTCDate ().toString ().padStart (2, '0');
	const month   = ( date.getUTCMonth () + 1 ).toString ().padStart (2, '0');
	const year    = date.getUTCFullYear ();
	
	return `${ hours }:${ minutes } ${ day } thg ${ month }, ${ year }`;
}
export const dateToMMDD = (timestamp) => {
	// Chuyển timestamp sang Date object với múi giờ GMT+7
	const date = new Date(timestamp);
	
	// Định dạng ngày tháng
	const options = {
		hour: '2-digit',
		minute: '2-digit',
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	};
	
	// Định dạng ngày theo chuẩn "Asia/Ho_Chi_Minh"
	const formattedDate = date.toLocaleString('en-US', options);
	
	return formattedDate;
}
export const convertTimestampToDate2 = (timestamp) =>  {
	const date = new Date(timestamp);
	return date.toISOString().split('T')[0];
}
export const convertTimestampToDate = (timestamp) =>  {
	const date = new Date(timestamp);
	return date.toLocaleDateString('en-CA'); // en-CA format corresponds to YYYY-MM-DD
}
