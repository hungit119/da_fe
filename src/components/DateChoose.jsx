import React, { useState } from 'react';
import { DatePicker, Drawer, Input, InputNumber } from "antd";

const DateChoose = ({
	                    open,
	                    onClose
                    }) => {
	const [dateRange, setDateRange]   = useState ({
		startDate       : null,
		endDate         : null,
		startDateString : null,
		endDateString   : null,
	})
	const [storyPoint, setStoryPoint] = useState (0)
	return (
		<Drawer title="Ngày" onClose={ onClose } open={ open }>
			<div className={ "nunito" }>
				<div className={ "nunito" }>
					<p className={ "font-bold mb-2" }>Ngày bắt đầu :</p>
					<DatePicker
						showTime
						onChange={ (date, dateString) => {
							setDateRange ({
								startDate       : date,
								startDateString : dateString,
							})
						} }
					/>
					<p className={"my-2 font-bold"}>Story point :</p>
					<InputNumber min={ 1 } max={ 100 } defaultValue={ 1 }
					             onChange={ (value) => setStoryPoint (value) }/>
				</div>
				<div className={ "my-4" }>
				</div>
			</div>
		</Drawer>
	);
};

export default DateChoose;
