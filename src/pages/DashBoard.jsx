import {DeleteOutlined, EditOutlined, LoadingOutlined, PlaySquareOutlined} from "@ant-design/icons";
import {Button, Card, Col, Form, Image, Input, Modal, Row, Select, Spin, Upload} from "antd";
import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import Board from "../assets/create-board.svg";
import {TYPE_BOARD_OPTIONS} from "../constant";
import {createBoard, deleteBoard, getBoard, getListBoard, updateBoard} from "../service";
import {getUserFromLocalStorage} from "../session";
import Meta from "antd/es/card/Meta";

const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        toast.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        toast.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
};
const DashBoard = () => {
    const [form] = Form.useForm();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [listBoard, setListBoard] = useState([]);
    const [id, setId] = useState(null);

    const showModalDelete = (id) => {
        setId(id)
        setIsModalDeleteOpen(true);
    };
    const handleOkDelete = () => {
        deleteBoard({board_id:id}).then((res => {
            if (res.data.code) {
                toast.success(res.data.message)
                setListBoard(listBoard.filter(board => board.id !== id))
                setIsModalDeleteOpen(false);
            }
        })).catch(err => {
            console.log(err)
            toast.error("Xóa bảng không thành công");
        })
    };
    const handleCancelDelete = () => {
        setIsModalDeleteOpen(false);
    };

    const showModal = (id) => {
        setIsModalOpen(true);
        if (id) {
            getBoard({board_id: id}).then((res) => {
                if (res.data.code === 200) {
                    const board = res.data.data
                    form.setFieldsValue({
                        name: board.name,
                        type: board.type
                    });
                    setImageUrl(board.avatar)
                    setId(id)
                }
            }).catch(err => {
                console.log(err)
            })
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoadingUpload(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoadingUpload(false);
            setImageUrl(info.file.response.url);
        }
    };
    const onFinish = (values) => {
        setLoading(true);
        const data = {
            ...values,
            avatar: imageUrl,
            user_id: getUserFromLocalStorage()?.id
        }
        if (id) {
            data.board_id = id
            updateBoard(data).then((res) => {
                setLoading(false);
                if (res.data.code === 200) {
                    toast.success(res.data.message);
                    setIsModalOpen(false);
                    setImageUrl("");
                    onReset();
                    setListBoard(listBoard.map(board => board.id === id ? {
                        ...board,
                        name: res.data.data.name,
                        type: res.data.data.type,
                        avatar: res.data.data.avatar,
                    } : board));
                    console.log(listBoard)
                }
            }).catch((err) => {
                console.log(err)
            })
        } else {
            createBoard(data).then((res) => {
                setLoading(false);
                if (res.data.code === 200) {
                    toast.success(res.data.message);
                    setIsModalOpen(false);
                    setImageUrl("");
                    onReset();
                    setListBoard([...listBoard, res.data?.data]);
                }
            }).catch((err) => {
                console.log(err)
            })
        }
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onReset = () => {
        form.resetFields();
    };

    const fetchListBoard = () => {
        setLoading(true)
        const param = {
            user_id: getUserFromLocalStorage()?.id
        }
        getListBoard(param).then(res => {
            if (res.data.code === 200) {
                setListBoard(res.data.data);
                setLoading(false);
            }
        }).catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {
        fetchListBoard();
    }, []);

    return (
        <div className='nunito'>
            <div className={"flex flex-row justify-between items-center"}>
                <p className={"text-xl font-bold mb-4"}>
                    CÁC BẢNG LÀM VIỆC CỦA BẠN
                </p>
                <div>
                    <Button type={"primary"} className="" onClick={showModal}>Tạo bảng mới</Button>
                </div>
            </div>
            <Row className={"gap-4 justify-center p-4"}>
                {
                    loading ? <div className={"w-100"}>
                        <Spin
                            indicator={
                                <LoadingOutlined
                                    style={{
                                        fontSize: 48,
                                    }}
                                    spin
                                />
                            }
                        />
                    </div> : (
                        listBoard.length > 0 ? listBoard.map(board => {
                            return <Col>
                                <Card
                                    key={board.id}
                                    className={"shadow-lg"}
                                    style={{
                                        width: 280,
                                    }}
                                    cover={
                                        <Image
                                            alt="example"
                                            src={board?.avatar ?? "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                                            height={100}
                                            className={"object-cover"}
                                        />
                                    }
                                    actions={[
                                        <PlaySquareOutlined key="play"/>,
                                        <EditOutlined key="edit" onClick={() => showModal(board?.id)}/>,
                                        <DeleteOutlined key="edit" onClick={() => showModalDelete(board?.id)}/>,
                                    ]}
                                >
                                    <Meta
                                        title={board.name}
                                    />
                                </Card>
                            </Col>
                        }) : <></>
                    )
                }
            </Row>
            <Modal className='nunito' width={"304px"} title="Basic Modal" open={isModalOpen} onCancel={handleCancel}
                   footer={[]}
            >
                <div className='flex flex-col items-center'>
                    <p className='my-2'>Tạo bảng</p>
                    <Image src={Board} alt='board'/>
                </div>
                <p className='my-2'>Phông nền</p>
                <div className='flex flex-col items-center my-4'>
                    <div className={"flex flex-row items-center"}>
                        <Upload
                            listType="picture-card"
                            className="avatar-uploader me-2"
                            showUploadList={false}
                            action="https://api.cloudinary.com/v1_1/dhhahwrmr/upload?upload_preset=ml_default"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                        >
                            {
                                loadingUpload ? <LoadingOutlined/> : <p>Upload</p>
                            }
                        </Upload>
                        {imageUrl && (
                            <Image
                                className={"border-2 rounded-lg"}
                                src={imageUrl}
                                alt="avatar"
                                style={{
                                    width: '100%',
                                }}
                            />
                        )}
                    </div>
                </div>
                <Form
                    form={form}
                    layout={"vertical"}
                    name="basic"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tiêu đề bảng"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng điền tên bảng!',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="Quyền xem"
                        name="type"
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng chọn quyền xem!',
                            },
                        ]}
                        initialValue={TYPE_BOARD_OPTIONS[0].value}
                    >
                        <Select options={TYPE_BOARD_OPTIONS.map(item => ({
                            value: item.value,
                            label: item.label
                        }))}>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal title="Xác nhận xóa bảng" open={isModalDeleteOpen} onOk={handleOkDelete} onCancel={handleCancelDelete}>
                <p>Bạn có chắc muốn xóa bảng : {id}</p>
            </Modal>
        </div>
    )
}

export default DashBoard
