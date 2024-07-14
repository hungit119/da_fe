import {
    DeleteColumnOutlined, DeleteOutlined,
    EditOutlined,
    EllipsisOutlined,
    LoadingOutlined,
    PlayCircleOutlined,
    PlaySquareOutlined,
    SettingOutlined
} from "@ant-design/icons";
import {Avatar, Button, Card, Form, Image, Input, Modal, Select, Upload} from "antd";
import React, {useEffect, useState} from 'react';
import {toast} from "react-toastify";
import Board from "../assets/create-board.svg";
import {TYPE_BOARD_OPTIONS} from "../constant";
import {createBoard, getListBoard} from "../service";
import {getUserFromLocalStorage} from "../session";
import Meta from "antd/es/card/Meta";
import {BiSolidTrash} from "react-icons/bi";

const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

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
    const [loadingUpload, setLoadingUpload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [listBoard, setListBoard] = useState([]);

    const showModal = () => {
        setIsModalOpen(true);
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
            <p className={"text-xl font-bold mb-4"}>
                CÁC BẢNG LÀM VIỆC CỦA BẠN
            </p>
            <div className={"grid grid-cols-4 gap-6"}>
                {
                    loading ? <LoadingOutlined/> : (
                        listBoard.length > 0 ? listBoard.map(board => {
                            return <Card
                                className={"shadow-lg"}
                                style={{
                                    width: 300,
                                }}
                                cover={
                                    <Image
                                        alt="example"
                                        src={board?.avatar ?? "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"}
                                        height={150}
                                        className={"object-cover"}
                                    />
                                }
                                actions={[
                                    <PlaySquareOutlined key="play" />,
                                    <EditOutlined key="edit" />,
                                    <DeleteOutlined key="edit" />,
                                ]}
                            >
                                <Meta
                                    title="Card title"
                                />
                            </Card>
                        }) : <></>
                    )
                }
                <div>
                    <Button className="p-11" onClick={showModal}>Tạo bảng mới</Button>
                </div>
            </div>
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
        </div>
    )
}

export default DashBoard
