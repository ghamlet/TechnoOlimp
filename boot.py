# This file is executed on every boot (including wake-boot from deepsleep)
#import esp
#esp.osdebug(None)

#import uos, machine
import network
from time import sleep
import urequests


surname ='eryui'
name ='eyee'
xin='56'
yin='34'
xout='76'
yout='34'
phone='785768534'
tim='254'

param = {
          'lastName':     f'{surname}', 
            'firstName':    f'{name}',
             'Xin':          f'{xin}',
              'Yin':          f'{yin}',
            'Xout':         f'{xout}',
             'Yout':         f'{yout}',
              'tel':          f'{phone}',
              'time':         f'{tim}'
                    
                }

print(param)
#uos.dupterm(None, 1) # disable REPL on UART(0)
#import gc
#import urequests
#import webrepl
#webrepl.start()
#gc.collect()
timeout = 0
wifi = network.WLAN(network.STA_IF)
wifi.active(False)
sleep(0.5)
wifi.active(True)

wifi.connect('Redmi','dmtr42042')

if not wifi.isconnected():
    print('conecting...')
    while (not wifi.isconnected() and timeout < 5):
        print(5 - timeout)
        timeout = timeout + 1
        sleep(1)
        
if (wifi.isconnected()):
    print('connected')
    
    rand_id = 123456787385345694851234
    print(len(rand_id))
    
    link = f'http://172.20.10.5:3003/users_add?id={rand_id}'
    print(link)
    req = urequests.get(f'{link}')
    
    
    
    print(req.status_code)
    print(req.text)
else:
    print('Time Out')
    print('not connected')
