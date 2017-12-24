from contextlib import closing
from videosequence import VideoSequence
import numpy as np
i = 0
val = []

import matplotlib.pyplot as plt

def get_heart_beat(frame,i):
    
    img = np.array(frame)
    #print(img.shape)
    
    metric = img.mean()
    val.append(metric)
    
    if (i%360 == 0):
        mean =  sum(val)/len(val)
        index = 1
        count=0
        for v in val[1:]:
            if(val[index]>=mean and val[index-1]<=mean):
                count+=1
            elif(val[index-1]>=mean and val[index]<=mean):
                count+=1
            index=index+1
        
        ans = (count*5)/2
        return ans
       

with closing(VideoSequence("test.mp4")) as frames:
    
    for idx, frame in enumerate(frames):
       i += 1
       img = np.array(frame)
       #print(img.shape)
       
       metric = img.mean()
       val.append(metric)
       
       if (i%360 == 0):
            mean =  sum(val)/len(val)
            index = 1
            count=0
            for v in val[1:]:
                if(val[index]>=mean and val[index-1]<=mean):
                    count+=1
                elif(val[index-1]>=mean and val[index]<=mean):
                    count+=1
                index=index+1
            
            ans = (count*5)/2
            print("Rate:",ans)
            print(mean)
            plt.plot(val)
            plt.plot(mean)
            #plt.plot
            plt.show()    
            val = []

       #print(i)
        #frame.save("frame{:04d}.jpg".format(idx))