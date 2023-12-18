import { StyleSheet, Text, View, TextInput, Switch, Button, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';
import COLORS from '../common/Color'
import axios from 'axios'
import firestore from '@react-native-firebase/firestore'
import fireauth from '@react-native-firebase/auth'
import { useNavigation, useRoute } from '@react-navigation/native';
const DetailAddress = () => {
    const router = useRoute()
    const navigation = useNavigation()
    const [open, setOpen] = useState(false);
    const [province, setProvince] = useState(router.params.province);
    const [items, setItems] = useState([]);
    const [open1, setOpen1] = useState(false);
    const [district, setDistrict] = useState(router.params.district);
    const [items1, setItems1] = useState([]);
    const [open2, setOpen2] = useState(false);
    const [ward, setWard] = useState(router.params.ward);
    const [items2, setItems2] = useState([]);
    const [data, setData] = useState([])
    const [checkName, setCheckName] = useState(true)
    const [checkPhone, setCheckPhone] = useState(true)
    const [checkAddress, setCheckAddress] = useState(true)
    const [name, setName] = useState(router.params.name)
    const [phone, setPhone] = useState(router.params.phone)
    const [isEnabled, setIsEnabled] = useState(false)
    const [isComplete, setIsComplete] = useState(true)
    const [isChange, setIsChange] = useState(false)
    const [isDetailAddress, setIsDetailAddress] = useState(true)
    const [detailAddress, setDetailAddress] = useState(router.params.detail)
    const [isSubmit, setIsSubmit] = useState(false)
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const getData = () => {
        axios.get(`https://provinces.open-api.vn/api/?depth=3`)
            .then(res => {
                const location = res.data;
                setData(res.data)
                setItems(location.map((e) => { return { label: e.name, value: e.name } }))
                res.data.forEach((e) => {
                    if (e.name == province) {
                        setItems1(e.districts.map((e) => { return { label: e.name, value: e.name } }))
                    }
                })
                res.data.forEach((e) => {
                    if (e.name == province) {
                        e.districts.forEach((e) => {
                            if (e.name == district) {
                                setItems2(e.wards.map((e) => { return { label: e.name, value: e.name } }))
                            }
                        })
                    }
                })
            })
            .catch(error => console.log(error));
    }
    useEffect(() => {
        getData()
        return () => { }
    }, [])
    useEffect(() => {
        data.forEach((e) => {
            if (e.name == province) {
                setItems1(e.districts.map((e) => { return { label: e.name, value: e.name } }))
                setItems2([])
                setDistrict(null)
                setWard(null)
            }
        })
        return () => { }
    }, [province])
    useEffect(() => {
        data.forEach((e) => {
            if (e.name == province) {
                e.districts.forEach((e) => {
                    if (e.name == district) {
                        setItems2(e.wards.map((e) => { return { label: e.name, value: e.name } }))
                        setWard(null)
                    }
                })
            }
        })
        return () => { }
    }, [district])
    useEffect(() => {
        if (province != null && district != null && ward != null)
            setIsDetailAddress(true)
        else {
            setDetailAddress('')
            setIsDetailAddress(false)
        }
        return () => { }
    }, [province, district, ward])
    useEffect(() => {
        if (isDetailAddress && detailAddress != '')
            setCheckAddress(true)
        else
            setCheckAddress(false)
        return () => { }
    }, [detailAddress])
    useEffect(() => {
        if (checkName && checkPhone && checkAddress)
            setIsComplete(true)
        else
            setIsComplete(false)
        return () => { }
    }, [checkAddress, checkName, checkPhone])
    useEffect(() => {
        if (isChange && isComplete)
            setIsSubmit(true)
        else
            setIsSubmit(false)
        return () => { }
    }, [isChange, isComplete])
    useEffect(() => {
        if (!router.params.selected) {
            if (name != router.params.name || phone != router.params.phone || province != router.params.province || district != router.params.district || ward != router.params.ward || detailAddress != router.params.detail || isEnabled != router.params.selected)
                setIsChange(true)
            else
                setIsChange(false)
        }
        else {
            if (name != router.params.name || phone != router.params.phone || province != router.params.province || district != router.params.district || ward != router.params.ward || detailAddress != router.params.detail)
                setIsChange(true)
            else
                setIsChange(false)
        }
        return () => { }
    }, [name, phone, province, district, ward, detailAddress, isEnabled])
    const removeAscent = (str) => {
        if (str === null || str === undefined) return str;
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        return str;
    }
    const validateName = (name) => {
        let regex = /^[a-zA-Z ]{2,}$/g
        if (regex.test(removeAscent(name))) {
            setCheckName(true)
        }
        else {
            setCheckName(false)
        }
    }
    const validatePhone = (phone) => {
        let regex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g
        if (regex.test(phone)) {
            setCheckPhone(true)
        }
        else {
            setCheckPhone(false)
        }
    }
    const onSubmit = async () => {
        if (!router.params.selected) {
            if (isEnabled) {
                await firestore()
                    .collection('Addresses')
                    .where('userID', '==', fireauth().currentUser.uid)
                    .get()
                    .then((QuerySnapshot) => {
                        QuerySnapshot.forEach((e) => {
                            e.ref.update({
                                selected: false
                            })
                        })
                    });
            }
            await firestore()
                .collection('Addresses')
                .doc(router.params.idAddress)
                .update({
                    name: name,
                    phone: phone,
                    province: province,
                    district: district,
                    ward: ward,
                    detail: detailAddress,
                    selected: isEnabled
                })
                .then(() => {
                    navigation.goBack()
                });
        }
        else {
            await firestore()
                .collection('Addresses')
                .doc(router.params.idAddress)
                .update({
                    name: name,
                    phone: phone,
                    province: province,
                    district: district,
                    ward: ward,
                    detail: detailAddress,
                })
                .then(() => {
                    navigation.goBack()
                });
        }
    }
    const deleteLocation = async () => {
      await firestore()
            .collection('Addresses')
            .doc(router.params.idAddress)
            .delete()
            .then(() => {
                navigation.goBack()
            });
    }
    return (
        <View style={{ flex: 1 }}>
            <Text style={{ margin: 16 }}>Liên hệ</Text>
            <TextInput placeholder='Họ và tên' value={name} style={{ paddingLeft: 10, backgroundColor: 'white' }} onChangeText={(text) => { validateName(text), setName(text) }} />
            {
                (!checkName && name != '') && <View style={{ paddingLeft: 10, backgroundColor: '#FFF4F3', height: 30, justifyContent: 'center' }}>
                    <Text style={{ color: '#D9415D' }}>Họ và tên không hợp lệ !</Text>
                </View>
            }
            <TextInput placeholder='Số điện thoại' value={phone} style={{ paddingLeft: 10, backgroundColor: 'white' }} keyboardType='phone-pad' maxLength={10} onChangeText={(text) => { validatePhone(text), setPhone(text) }} />
            {
                (!checkPhone && phone != '') && <View style={{ paddingLeft: 10, backgroundColor: '#FFF4F3', height: 30, justifyContent: 'center' }}>
                    <Text style={{ color: '#D9415D' }}>Số điện thoại không hợp lệ !</Text>
                </View>
            }
            <Text style={{ margin: 16 }}>Địa chỉ</Text>
            <DropDownPicker
                style={{ borderWidth: 0 }}
                placeholder='Chọn tỉnh/thành phố'
                zIndex={10}
                open={open}
                value={province}
                items={items}
                setOpen={setOpen}
                setValue={setProvince}
                setItems={setItems}
            />
            <DropDownPicker
                style={{ borderWidth: 0 }}
                placeholder='Chọn quận/huyện'
                zIndex={5}
                open={open1}
                value={district}
                items={items1}
                setOpen={setOpen1}
                setValue={setDistrict}
                setItems={setItems1}
            />
            <DropDownPicker
                style={{ borderWidth: 0 }}
                placeholder='Chọn phường/xã'
                zIndex={3}
                open={open2}
                value={ward}
                items={items2}
                setOpen={setOpen2}
                setValue={setWard}
                setItems={setItems2}
            />
            <TextInput placeholder='Tên đường, Tòa nhà, Số nhà.' value={detailAddress} style={{ paddingLeft: 10, backgroundColor: 'white' }} editable={isDetailAddress} onChangeText={setDetailAddress} />

            {
                !router.params.selected && <View>
                    <Text style={{ margin: 16 }}>Cài đặt</Text>
                    <View style={{ backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', height: 45 }}>
                        <Text style={{ color: 'black', marginLeft: 10 }}>Đặt làm địa chỉ mặc định</Text>
                        <Switch
                            trackColor={{ false: "#767577", true: COLORS.backgroundWeak }}
                            thumbColor={isEnabled ? COLORS.custom : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>
            }
            <View style={{ height: 40 }} />
            <TouchableOpacity style={{ height: 40, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }} activeOpacity={1} onPress={deleteLocation}>
                <Text style={{ color: COLORS.custom }}>Xóa địa chỉ</Text>
            </TouchableOpacity>
            <Button title='Cập nhật thông tin' disabled={!isSubmit} color={COLORS.custom} onPress={onSubmit} />
        </View>
    )
}

export default DetailAddress

const styles = StyleSheet.create({})