<template>
    <div>
        <Card style="width:700px;">
            <p slot="title">
                {{vm.$t('mall.spxg')}}
                <i class="ivu-icon ivu-icon-close" style="float:right;cursor:pointer;" @click="closeDialog"></i>
            </p>
            <Row style="border-bottom:1px solid #e9eaec;">
                <Col span="4">{{vm.$t('mall.tp')}}</Col>
                <Col span="6"><img :src="src" class="img"></Col>
                <Col span="10">
                    <input type="file" ref="img" @change="getImg()">
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('iconFile')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="4">{{vm.$t('mall.zkj')}}</Col>
                <Col span="6">{{this.item.discountPrice}}</Col>
                <Col span="10">
                    <numberbox v-model="discountPrice" style="width: 220px;border:1px solid #dddee1"></numberbox>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('discountPrice')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="4">{{vm.$t('mall.yj')}}</Col>
                <Col span="6" style="white-space: nowrap;">{{this.item.originalPrice}}</Col>
                <Col span="10">
                    <numberbox v-model="originalPrice" style="width: 220px;border:1px solid #dddee1"></numberbox>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('originalPrice')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="4">{{vm.$t('mall.mc')}}</Col>
                <Col span="6"><span style="white-space: nowrap">{{this.item.productName}}</span></Col>
                <Col span="10">
                    <Input v-model="productName" style="width: 220px"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('productName')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;height:45px; line-height:40px;">
                <Col span="4">{{vm.$t('mall.ywm')}}</Col>
                <Col span="6"  style="white-space: nowrap">{{this.item.productNameEn}}</Col>
                <Col span="10">
                    <Input v-model="productNameEn" style="width: 220px"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('productNameEn')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;line-height:40px;">
                <Col span="4">{{vm.$t('mall.jj')}}</Col>
                <Col span="6">{{this.item.productDescription}}</Col>
                <Col span="10">
                    <Input v-model="productDescription" type="textarea" style="width: 220px"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('productDescription')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
            <Row style="margin-top：10px;border-bottom:1px solid #e9eaec;line-height:40px;">
                <Col span="4">{{vm.$t('mall.ywjj')}}</Col>
                <Col span="6">{{this.item.productDescriptionEn}}</Col>
                <Col span="10">
                    <Input v-model="productDescriptionEn" type="textarea" style="width: 220px"></Input>
                </Col>
                <Col span="3">
                    <Button type="primary" @click="tabs('productDescriptionEn')">{{vm.$t('common.bc')}}</Button>
                </Col>
            </Row>
        </Card>
    </div>
</template>

<script>
    import util from '../../../libs/util';
    import Numberbox from '../../components/dialog/numberbox';
    import mallApi from '../../../api/mall';

    export default {
        components: {Numberbox},
        props: ['item'],
        data () {
            const vm = window.vm;
            return {
                vm: vm,
                src: null,
                discountPrice: null,
                originalPrice: null,
                productName: null,
                productNameEn: null,
                productDescription: null,
                productDescriptionEn: null,
                iconFile: null
            };
        },
        created () {
            this.src = util.baseURL + this.item.coverImgPath;
        },
        methods: {
            closeDialog () {
                this.$emit('removeDialog');
                this.$emit('okCallback');
            },
            tabs (id) {
                let data = new FormData();
                data.append('productId', this.item.productId);
                data.append('_method', 'put');
                if (this[id]) {
                    data.append(id, this[id]);
                    mallApi.updataProducts(data, (res) => {
                        this.$Message.success({content: this.vm.$t('common.xgcg')});
                        this.getInfo();
                    }, (msg) => {
                        this.$Message.error({content: msg});
                    });
                } else {
                    this.$Message.error({content: this.vm.$t('common.bnwk')});
                }
            },
            getInfo () {
                let data = {
                    productId: this.item.productId
                };
                mallApi.getProducts(data, (res) => {
                    this.item = res;
                    this.src = util.baseURL + res.coverImgPath
                });
            },
            getImg () {
                this.iconFile = this.$refs.img.files[0];
                console.log(this.iconFile)
            }
        }
    };
</script>

<style scoped>
    .img {
        height: 40px;
    }
</style>
