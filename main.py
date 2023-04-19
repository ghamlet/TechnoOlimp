from geopy.geocoders import Nominatim
from geopy import distance
import random
import telebot
from telebot import types
import string

import requests

 
# RESULT =''
# data_dron=[]
# dron_with_distance_to_dostavka=[]
# dron_with_distance_to_otpravka=[]
# from_otpravka_to_dostavka = 0

# count = 0 
# SPEED = 100 #скорость дрона
# TARIFF = [20, 50,100,200] # виды тарифов  - стоимость в рублях 1 км полета 
# message=[]


bot = telebot.TeleBot('6262557241:AAFQbMMgy523zGb7Qb4Adh5GXBMyVELeb-c')#'6250998139:AAF-JB2SayuIK4di6wzvqgGR6AJ7-SKQkVA')
  
name = ''
surname = ''
phone = ''

adres_in = ''
adres_out = ''
time = ''



@bot.message_handler(commands=['start']) 
def start(message):
    bot.send_message(message.from_user.id, 
    """Привет, тут ты можешь заказать себе доставку товара коптером.
Как тебя зовут?""")
    bot.register_next_step_handler(message, get_name); # register_next_step_handler - 
    #переход к следующей функции 
    

def get_name(message): #получаем имя
    global name
    name = message.text

    bot.send_message(message.from_user.id, 'Какая у тебя фамилия?') #бот задает вопрос
    bot.register_next_step_handler(message, get_surname)


def get_surname(message): #получаем фамилию
    global surname
    surname = message.text

    bot.send_message(message.from_user.id, 'Введи номер своего телефона')
    bot.register_next_step_handler(message, get_phone)


def get_phone(message): #получаем телефон
    global phone
    phone = message.text

    bot.send_message(message.from_user.id, 'Введите время в минутах, за которое должен быть доставлен заказ')
    bot.register_next_step_handler(message, get_time)




def get_time(message): #получаем время на выполнение заказа
    global time
    time = message.text

    bot.send_message(message.from_user.id, """Введи адрес места, куда надо доставить груз строго по образцу, то что написано в скобках Вам писать не надо.
(город) Владимир (улица/проспект) Юбилейная (дом) 50""")
    bot.register_next_step_handler(message, get_adres_out)


def get_adres_out(message): #куда доставить
    global adres_out
    adres_out = message.text

    bot.send_message(message.from_user.id, """Введи адрес места, откуда надо забрать груз строго по образцу, то что написано в скобках Вам писать не надо.
(город) Владимир (улица/проспект) Юбилейная (дом) 50""")
    bot.register_next_step_handler(message, get_adres_in)


def get_adres_in(message): #получаем адрес отправки
    global adres_in
    adres_in = message.text

    keyboard = types.InlineKeyboardMarkup()                              #наша клавиатура
    key_yes = types.InlineKeyboardButton(text='Да', callback_data='yes') #кнопка «Да»
    keyboard.add(key_yes)                                                #добавляем кнопку в клавиатуру
    key_no= types.InlineKeyboardButton(text='Нет', callback_data='no')
    keyboard.add(key_no)

    question = (f'{name} {surname} , Вы готовы принять заказ на адрес {adres_out} ?') # текст для отправки ботом
    bot.send_message(message.from_user.id, text=question, reply_markup=keyboard)

    

@bot.callback_query_handler(func=lambda call: True)
def callback_worker(call):

    if call.data == "yes":    # если нажали кнопку ДА
        """функция геолакации"""

        geolocator = Nominatim(user_agent="Mozilla/5.0 Windows NT 10.0; Win64; x64 AppleWebKit/537.36 KHTML, like Gecko Chrome/110.0.0.0 Safari/537.36")
        
        location_dostavki = geolocator.geocode(adres_out, timeout=1) # адрес куда доставить

        if hasattr(location_dostavki, 'latitude'):  #проверка есть ли атрибут, чтоб не выдало ошибку если атрибута нет
            
            loc_dostavki = (location_dostavki.latitude, location_dostavki.longitude) # данные с координатами передаются дронам
            print("Координаты места доставки", loc_dostavki)
            
            xout = loc_dostavki[0]
            yout = loc_dostavki[1]

        else:
            print("Адрес доставки не найден")



        location_otpravki = geolocator.geocode(adres_in, timeout=1) # адрес откуда взять товар

        if hasattr(location_otpravki, 'latitude'):  #проверка есть ли атрибут, чтоб не выдало ошибку если атрибута нет
            
            loc_otpravki = (location_otpravki.latitude, location_otpravki.longitude) # данные с координатами передаются дронам
            print("Координаты места отправки", loc_otpravki)
            
            xin = loc_otpravki[0]
            yin = loc_otpravki[1]

        else:
            print("Адрес отправки не найден")





        



        """JSON - Текстовый формат обмена данными"""
        param = {
                    'lastName':     f'{surname}', 
                    'firstName':    f'{name}',
                    'Xin':          f'{xin}',
                    'Yin':          f'{yin}',
                    'Xout':         f'{xout}',
                    'Yout':         f'{yout}',
                    'tel':          f'{phone}',
                    'time':         f'{time}'
                    
                }  
        print(param)
        



        """генерация случайного айди"""
        rand_id = ''
        for i in range(1, 25):
            digits = string.digits
            rand_id = rand_id + str((digits[random.randint(0,9)]))
        print(len(rand_id))



        """метод для отправки данных на сайт"""
        resp = f"http://10.78.108.240:3003/users_add?ide={rand_id}"
        requests.post(f"{resp}", data=param) 
        
   

        userlink = f"http://10.78.108.240:3003/users_add?id={rand_id}"
        print(userlink)
    

        bot.send_message(call.message.chat.id, f"""Перейдите по ссылке для выбора дрона
{userlink} """)







    elif call.data == "no":
        bot.send_message(call.message.chat.id, 'Если хочешь попробовать ещё раз напиши  /start ')

bot.polling(none_stop=True, interval=3)


