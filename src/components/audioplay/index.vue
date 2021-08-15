<template>
    <div class="audioplay" >
         <audio
            ref="audio"
            style="display:none"
            @pause="onPause"
            @play="onPlay"
            @timeupdate="onTimeupdate"
            @loadedmetadata="onLoadedmetadata"
            :src="musicDa.musicUrl"
            controls="controls"
            ></audio>
        <div class="audioplay-left">
            <img src="./image/play.png" alt="" @click="startPlayOrPause" v-if="!audio.playing">
            <img src="./image/pause.png" alt="" @click="startPlayOrPause" v-else>
        </div>
        <div class="audioplay-right">
            <div class="audioplay-right-one">
                <span>{{musicDa.musicTitle}}</span>
                <i class="iconfont icon-close" @click="closeMusic"></i>
            </div>
            <div class="audioplay-right-two">
                <a-slider
                :tip-formatter="formatProcessToolTip"
                @change="changeCurrentTime"
                v-model="sliderTime"
                class="slider"
                :step="1"
                :max="audio.maxTime"
                :min="0"
                id="test"
                :default-value="0"
                style="width:100%"
                ></a-slider>
            </div>
            <div class="audioplay-right-three">
                <div class="audioplay-right-three-time">
                    <span class="statrTime">{{audio.currentTime|formatSecond}}</span>
                    <span class="sb">/</span>
                    <span class="endTimer"> {{audio.maxTime|formatSecond}}</span>
                </div>
                <div class="audioplay-right-three-btn" >
                    <div class="audioplay-speed" @click="showspeed" :style="{'color':isshowSpeed?'#fff':'#999'}">{{audio.playbackRate==1?'倍数':audio.playbackRate+'x'}}</div>
                    <div class="audioplay-volume">
                        <div v-if="userStopValum">
                            <img src="./image/mute.png" alt="" @click="showvolum">
                        </div>
                        <div v-else>
                            <img src="./image/no.png" alt="" @click="showvolum" v-if="!isshowvolume">
                        <img src="./image/yes.png" alt="" @click="showvolum" v-else>
                        </div>
                        
                    </div>
                </div>
                <!-- 倍数菜单 -->
                <div class="speedbox animated slideInLeft" v-show="isshowSpeed">
                    <ul>
                        <li v-for="(item,index) in speedList" :key='index' @click="selectspeed(item)">{{item}}x</li>
                    </ul>
                </div>
                <!-- 音量菜单 -->
                <div class="volumebox animated slideInLeft" v-if="isshowvolume">
                    <span class="volumenum">{{volum}}</span>
                    <div style="display: inline-block;height:97px;">
                        <a-slider vertical :default-value="volum" :tooltipVisible='false' @change="changevolum" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 将整数转换成 时：分：秒的格式
function realFormatSecond(second) {
  var secondType = typeof second;
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second);
    var hours = Math.floor(second / 3600);
    second = second - hours * 3600;
    var mimute = Math.floor(second / 60);
    second = second - mimute * 60;
    hours = hours < 10 ? '0' + hours : hours;
    return (
      hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    );
  } else {
    return '00:00:00';
  }
}
export default {
    name:'audioplay',
    data(){
        return {
            sliderTime: 200,
            audio: {
                // 该字段是音频是否处于播放状态的属性
                playing: false,
                // 音频当前播放时长
                currentTime: 0,
                // 音频最大播放时长
                maxTime: 0,
                // 倍速
                playbackRate: 1,
            },
            //是否显示倍速盒子
            isshowSpeed:false,
            //倍速
            speedList:[0.5,1.0,1.5,2],
            //是否显示音量菜单
            isshowvolume:false,
            //音量
            volum:100,
            //用户是否把音量关到了静音
            userStopValum:false
        }
    },
    props:{
        musicDa:{
            type:Object,
            default(){
                return {
                    musicTitle:'音乐播放器的名字',
                    musicUrl:'https://wdd.js.org/element-audio/static/falling-star.mp3'
                }
            }
        }
    },
    filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second);
    },
  },
    methods:{
        closeMusic(){
            this.$store.commit('settings/SetDisplayMusic',false)
        },
        // 控制音频的播放与暂停
    startPlayOrPause() {
      this.audio.playing = !this.audio.playing;
      return this.audio.playing ? this.play() : this.pause();
    },
    // 播放音频
    play() {
      this.$refs.audio.play();
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause();
    },
        // 当加载语音流元数据完成后，会触发该事件的回调函数
        // 语音元数据主要是语音的长度之类的数据
        onLoadedmetadata(res) {
            this.audio.maxTime = parseInt(res.target.duration);
        },
        // 当音频当前时间改变后，进度条也要改变
        onTimeupdate(res) {
            this.audio.currentTime = parseInt(res.target.currentTime);
            this.sliderTime = this.audio.currentTime;
            if (this.audio.currentTime == this.audio.maxTime) {
                // this.onPause();
                this.startPlayOrPause();
            }
        },
        // 当音频播放
        onPlay() {
        this.audio.playing = true;
        },
        // 当音频暂停
        onPause() {
        this.audio.playing = false;
        },
        //调整音量
        changevolum(data){
            console.log(data)
            if(data==0){
               this.userStopValum = true
            }else{
                this.userStopValum = false
            }
            this.volum = data
            this.$refs.audio.volume = data / 100
            setTimeout(()=>{
                this.isshowvolume = false
            },1800)
            
        },
        showvolum(){
            this.isshowvolume = !this.isshowvolume
            this.isshowSpeed = false
        },
        showspeed(){
            this.isshowvolume = false
            this.isshowSpeed = !this.isshowSpeed
        },
        //用户选择了 倍速
        selectspeed(data){
            console.log(data)
            this.audio.playbackRate = data
            this.$refs.audio.playbackRate = this.audio.playbackRate;
            this.isshowSpeed = false
            
        },
        // 进度条格式化toolTip
        formatProcessToolTip(index = 0) {
            index = parseInt(index);
      return '进度: ' + realFormatSecond(index);
        },
        changeCurrentTime(index){
                this.$refs.audio.currentTime = parseInt(index);
        }
    }
}
</script>

<style scoped lang='scss'>
ul{
    margin: 0;
    padding: 0;
    li{
        list-style: none;
    }
}
.audioplay{
    width: 600px;
    height: 120px;
    background-color: #333333;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 8888;
    display: flex;
    .audioplay-left{
        width: 120px;
        height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba($color: #ffffff, $alpha: 0.06);
        img{
            width: 66px;
            height: 66px;
            cursor: pointer;
        }

    }
    .audioplay-right{
        padding: 19px;
        box-sizing: border-box;
        width: 480px;
        .audioplay-right-one{
            position: relative;
            span{
                font-size: 14px;
                color: #fff;
            }
            i{
                position: absolute;
                right: -10px;
                top: -10px;
                color: #999;
                &:hover{
                    color: #fff;
                    cursor: pointer;
                }
            }
        }
        .audioplay-right-two{
            ::v-deep .ant-slider-handle{
                    border: none !important;
                    width: 12px;
                    height: 12px;
                    background-color: #fff;
                }
                ::v-deep .ant-slider-track{
                    background-color: #16AFFE !important;
                }
                ::v-deep .ant-slider-step{
                    height: 5px !important;
                }
        }
        .audioplay-right-three{
            display: flex;
            align-items: center;
            position: relative;
            .audioplay-right-three-time{
                width: 130px;
                margin-left: 3px;
                span{
                    font-size: 14px;
                }
                .statrTime{
                    color: #fff;
                }
                .sb{
                    color: #999;
                    margin: 0 3px;
                }
                .endTimer{
                    color: #999;
                }
            }
            .speedbox{
                width: 88px;
                height: 144px;
                background-color: #333333;
                border-radius: 4px;
                position: absolute;
                right:60px;
                bottom: -168px;
                ul{
                    li{
                        color: #fff;
                        height: 36px;
                        line-height: 36px;
                        font-size: 14px;
                        text-align: center;
                        cursor: pointer;
                        &:hover{
                            font-weight: bold;
                        }
                    }
                }
            }
             .volumebox{
               width: 88px;
                height: 144px;
                background-color: #333333;
                position: absolute;
                 right:-10px;
                bottom: -168px;
                border-radius: 4px;
                display: flex;
                flex-direction: column;
                align-items: center;
                .volumenum{
                    color: #fff;
                    font-size: 14px;
                    margin-top: 11px;
                }
                ::v-deep .ant-slider-handle{
                    border: none !important;
                    width: 12px;
                    height: 12px;
                    background-color: #16AFFE;
                }
                :v-deep .ant-slider-track{
                    background-color: #65CBFF;
                }
          }
        }
        .audioplay-right-three-btn{
            display: flex;
            align-items: center;
            // margin-right: 13px;
            margin-left: 180px;
          .audioplay-speed{
                width: 48px;
                height: 26px;
                border-radius: 13px;
                border: 1px solid #999999;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                margin-right: 20px;
                cursor: pointer;
                transition: .3s;
                &:hover{
                    border: 1px solid #fff;
                    color: #fff;
                }
          }  
          .audioplay-volume{
              cursor: pointer;
              width: 48px;
                height: 26px;
                border-radius: 13px;
                border: 1px solid #999999;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #999;
                img{
                    width: 20px;
                    height: 20px;
                }
          }
         
        }
    }
}
</style>