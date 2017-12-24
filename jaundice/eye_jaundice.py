import cv2
import numpy as np
import imutils
from imutils import face_utils
import dlib
import os

def findJaundice(f) :
    #dir = './data/'

    #files = os.listdir(dir)
    #for f in files:
    #print f
    jaundice = False
    img_color = cv2.imread(f)
    img = cv2.imread(f, cv2.IMREAD_GRAYSCALE)
    print img.shape
    detector = dlib.get_frontal_face_detector()
    predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')
        
    detected = detector(img, 1)
        
    for i, detect in enumerate(detected):
        print "processing..."
        shape = predictor(img, detect)
        shape = face_utils.shape_to_np(shape)
        
        for (name, (i,j)) in face_utils.FACIAL_LANDMARKS_IDXS.items():
            if name == "right_eye" or name == "left_eye":
                print i,j, name
                x,y,w,h = cv2.boundingRect(np.array([shape[i:j]]))
                eye = img_color[y:y+h, x:x+w]
                
                #cv2.imshow("Eye", eye)
                #cv2.waitKey(0)
                cv2.imwrite(name+'.png', eye)
                lower = np.array([5,105,140])
                upper = np.array([50, 200, 260])
                mask = cv2.inRange(eye, lower, upper)
                output = cv2.bitwise_and(eye, eye, mask = mask)
                if np.max(output) != 0:
                    jaundice = True

    return jaundice
                

