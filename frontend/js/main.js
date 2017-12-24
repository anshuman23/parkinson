
 let k = 0
 let vidInterval = ''
 let frames = []
 let image_skip = 30
 let fps = 5
 const SUPPORTS_MEDIA_DEVICES = 'mediaDevices' in navigator;
 var acontext=new AudioContext()
 var o=null
 var g=null
 var var1=0.01
 let volInterval = ''
 let frequency = 500
 let deafness = []
 let canvas = document.getElementById('canvas');
 let context = canvas.getContext('2d');
 let video = document.getElementById('video');
 let URL = "https://192.168.8.223:8777/people"

function hideAll() {
    document.getElementById('video').style.display = 'none'
    document.getElementById('canvas').style.display = 'none'
    document.getElementById('jaundice').style.display = 'none'
    document.getElementById('show-jaundice').style.display = 'none'
    document.getElementById('snap').style.display = 'none'
    document.getElementById('start').style.display = 'none'
    document.getElementById('stop').style.display = 'none'
    document.getElementById('hear').style.display = 'none'
}

function showAll() {
    hideAll()
    document.getElementById('show-jaundice').style.display = 'block'
    document.getElementById('snap').style.display = 'block'
    document.getElementById('start').style.display = 'block'
}


function sendImg(img,url) {


    $.post( url, {'tests':img} )
        .done(function( data ) {
            document.getElementById('jaundice-box').innerHTML = data
            document.getElementById('jaundice-box').style.display = 'block'
            showAll()
        })
        .catch( (err) => {
            console.log('Error')
            document.getElementById('jaundice-box').innerHTML = 'no-jaundice'
            document.getElementById('jaundice-box').style.display = 'block'
            showAll()
        });


}

function _base64ToArrayBuffer(base64) {
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
}

function _mean(arr) {

    let _sum = 0
    for (var i = 0; i < arr.length; i++){
        _sum += arr[i]
    }

    return _sum/arr.length
}

function getHeartRate() {

    let mean_all = _mean(frames)
    let count = 0
    for (let i =  1 ;i<frames.length;i++) {
        if(frames[i-1] <= mean_all && frames[i] >= mean_all) {
            count++
        } else if(frames[i] <= mean_all && frames[i-1] >= mean_all) {
            count++
        }
    }

    count /= 2

    renderChart(getHeartFrames(frames),"Heart Echo Cardiograph")
    count *= (fps/frames.length)*60
    alert('Heart Rate: ' + count)
    frames = []
    k = 0

    document.getElementById('video').style.display = 'none'
    document.getElementById('canvas').style.display = 'none'
    showAll()

}

function getHeartFrames(frames) {
    let new_frames = new Array()
    for (let i = 0;i<frames.length;i++) {
        new_frames.push({y: frames[i]})
    }

    return new_frames
}


function renderChart(frames,label) {

    document.getElementById('chartContainer').style.display = 'block'
    new_frames = []
    if(label == 'Deaf Ear Scale') {
        new_frames.push({x:500,y:0.014})
        new_frames.push({x:8000,y:0.014})
    }

    var chart = new CanvasJS.Chart("chartContainer", {
        animationEnabled: true,
        theme: "light2",
        title:{
        text: label
    },
    axisY:{
        includeZero: false
    },
    data: [{        
            type: "line",       
            dataPoints: frames
        },
        {        
            type: "line",       
            dataPoints: new_frames
        }]
    });

    chart.render();


}


function getFrame() {
    k++
    context.drawImage(video, 0, 0, 500, 500);
    let image_arr = canvas.toDataURL('image/png');

    if(image_arr.length < 10000) {
        
        frames = []
        return
    }

    let url = "https://192.168.43.162:9290/people"
    image_arr = image_arr.substr(22,image_arr.length)
    
    image_arr = _base64ToArrayBuffer(image_arr) 

    let mean = _mean(image_arr)
   
    if(k > image_skip) {
        frames.push(mean)
    }
    

    if(frames.length >= 120) {
        clearInterval(vidInterval)
        getHeartRate()
    }

}


function startNoise() {
    var1=0.01
    o = acontext.createOscillator()
    g = acontext.createGain()
    o.connect(g)
    g.connect(acontext.destination)
    o.frequency.value = frequency
    o.start(.01)
    g.gain.exponentialRampToValueAtTime(
        0.0001, acontext.currentTime + 0.04
    )


    volInterval = setInterval(function() {
        if(g) {
            g.gain.exponentialRampToValueAtTime(
                var1+0.001, acontext.currentTime + 0.04
            )
            var1 += 0.001
        }
    },1000)

}



// Put event listeners into place
window.addEventListener("DOMContentLoaded", function() {
    // Grab elements, create settings, etc.
    navigator.mediaDevices.enumerateDevices().then( (devices) => {
            const cameras = devices.filter((device) => device.kind === 'videoinput');
            //alert(cameras[0].deviceId + " pussy  "  + cameras[1].deviceId)
            
            let deviceid = ''

            if(cameras[1]) {
                deviceid = cameras[1].deviceId
            }
            else {
                deviceid = cameras[0].deviceId
            }
            

            let mediaConfig =  { video: {
                deviceId: deviceid
                } 
            };


            navigator.mediaDevices.getUserMedia(mediaConfig)
            .then(function(stream) {
                

                const track = stream.getVideoTracks()[0];

                //Create image capture object and get camera capabilities
                const imageCapture = new ImageCapture(track)
                const photoCapabilities = imageCapture.getPhotoCapabilities().then(() => {
                    track.applyConstraints({
                        advanced: [{torch: true}]
                    });

                    video.src = window.URL.createObjectURL(stream);
                    video.play();

                    
                })

                
            });

        })
    
    let errBack = function(e) {
        console.log('An error has occurred!', e)
    };

    // Trigger photo take
    $("#jaundice").on("click", function() {
        
        context.drawImage(video, 0, 0, 500, 500);
        let img = canvas.toDataURL('image/png');
      
        sendImg(img,URL)
    });

    // Trigger photo take
    $("#show-jaundice").on("click", function() {
        hideAll()
        document.getElementById('video').style.display = 'block'
        document.getElementById('jaundice').style.display = 'block'
        document.getElementById('canvas').style.display = 'none'
    });


    $("#start").on("click",
        function(e){
            hideAll()
            document.getElementById('start').style.display = 'block'
            document.getElementById('hear').style.display = 'block'
            
            e.preventDefault()
            deafness = []
            var $target=$(e.target)
            eval($target.data("source"))
            // o = acontext.createOscillator()
            // o.type = "sine"
            // o.connect(acontext.destination)

            startNoise()
    })


    $("#hear").on("click",function(e){
        e.preventDefault()

        

        clearInterval(volInterval)
        o.stop()
        
        
        if(frequency <= 8000) {
            deafness.push({x:frequency,y:var1})
            startNoise()
        } else {
            showAll()
            renderChart(deafness,"Deaf Ear Scale")
            
        }
        
        
        frequency *= 2
        

    })
    
    

    $("#snap").on("click", function() {
        hideAll()
       
        document.getElementById('video').style.display = 'block'
        document.getElementById('canvas').style.display = 'none'
        vidInterval = setInterval(getFrame,fps)
    
    });



    showAll()
    
    

}, false);
