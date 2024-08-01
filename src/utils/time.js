export const dateToHMDDMonthYYYY = (timestamp) => {
	const date = new Date (timestamp * 1000);
	
	const hours   = date.getUTCHours ().toString ().padStart (2, '0');
	const minutes = date.getUTCMinutes ().toString ().padStart (2, '0');
	const day     = date.getUTCDate ().toString ().padStart (2, '0');
	const month   = ( date.getUTCMonth () + 1 ).toString ().padStart (2, '0');
	const year    = date.getUTCFullYear ();
	
	return `${ hours }:${ minutes } ${ day } thg ${ month }, ${ year }`;
}
