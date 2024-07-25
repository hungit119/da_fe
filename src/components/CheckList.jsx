import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { Button, Checkbox, Input, Progress, Spin } from "antd";

const CheckList = ({checklist, showForm, setShowForm, setNameCheckListItem, handleClickSaveCheckListItem, saving}) => {
	return (
		<div className={ "my-6" }>
			<div className={ "flex justify-between items-center" }>
				<div className={ "flex items-center" }>
					<FontAwesomeIcon className={ "me-4" } icon={ faCheckSquare } size={ "xl" }/>
					<p className={ "text-lg" }>{ checklist?.name }</p>
				</div>
				<Button type={ "primary" }>Xóa</Button>
			</div>
			<div className={ "my-2" }>
				<Progress percent={ 50 }
				          percentPosition={ {
					          type  : "outer",
					          align : "start"
				          } }/>
			</div>
			{
				showForm.show && showForm.id === checklist.id ?
					<div>
						<Input variant={ "filled" } rootClassName={ "py-4 nunito text-white my-4" }
						       placeholder={ "Thêm một mục" }
						       onChange={ (value) => setNameCheckListItem (value, checklist.id) }/>
						<Button type={ "primary" } className={ "bg-blue-500 me-2" }
						        onClick={ () => handleClickSaveCheckListItem () }
						        disabled={ saving }
						>
							{
								saving ? <Spin/> : "Lưu"
							}
						</Button>
						<Button type={ "primary" } onClick={ () => setShowForm ({
							show : false,
							id   : -1
						}) }>Hủy</Button>
					</div>
					: <div>
						<div>
							{
								checklist?.check_list_items?.length > 0 && <>
								{
									checklist?.check_list_items?.map ((checklistItem, index) => (
										<div key={index} className={"flex items-center my-4"}>
											<Checkbox  checked={checklistItem?.is_checked === 1} className={"me-2"}/> <p>{checklistItem?.name}</p>
										</div>
									))
								}
								</>
							}
						</div>
						<Button type={ "primary" } onClick={ () => setShowForm ({
							show : true,
							id   : checklist.id,
						}) }>Thêm một mục</Button>
					</div>
			}
		</div>
	);
};

export default CheckList;
