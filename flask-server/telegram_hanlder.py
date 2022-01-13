from telegram import Update, ForceReply, ParseMode, Poll
import telegram
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext, updater, CallbackQueryHandler
import requests
from telegram.inline.inlinekeyboardbutton import InlineKeyboardButton
from telegram.inline.inlinekeyboardmarkup import InlineKeyboardMarkup
import json


def start(update: Update, context: CallbackContext) -> None:
    try:
        user = update.effective_user
        username = user.full_name
        update.message.reply_text(f"Hello, {username}!")
        update.message.reply_text("Please choose an option:")
        update.message.reply_text("/register <user-name> - Register to start answering polls via telegram \n/remove <user-name> - To stop getting polls queries \n/start - Use start anytime to see this menu again")
    except Exception as e:
        update.message.reply_text("Oops!")


def register(update: Update, context: CallbackContext) -> None:
    try:
        """Send a message when the command /start is issued."""
        user = update.effective_user
        effective_id, username = user.id, user.full_name
        r = requests.post(url = 'http://localhost:5000/add_user', data = {'effective_id': effective_id, 'username': username})
        if r.status_code == 200:
            update.message.reply_text("Welcome!")
        elif r.status_code == 409:
            update.message.reply_text("You are already registered!")
        else:
            update.message.reply_text("Oops!")

    except Exception as e:
        pass


def remove(update: Update, context: CallbackContext) -> None:
    try:
        """Send a message when the command /start is issued."""
        user = update.effective_user
        effective_id, username = user.id, user.full_name
        r = requests.post(url = 'http://localhost:5000/remove_user', data = {'effective_id': effective_id})
        if r.status_code == 200:
            update.message.reply_text("Deleted!")
        else:
            update.message.reply_text("Oops!")
    except Exception as e:
        pass


def echo(update: Update, context: CallbackContext) -> None:
    """Echo the user message."""
    update.message.reply_text(update.message.text)


def poll(bot, question, answers, ids, poll_id):
    button_list = []
    for answer in answers:
        detailed_answer = {"poll_id": poll_id, "answer": answer}
        button_list.append(InlineKeyboardButton(answer, callback_data = json.dumps(detailed_answer)))
    reply_markup=InlineKeyboardMarkup(build_menu(button_list,n_cols=1)) #n_cols = 1 is for single column and mutliple rows
    for id in ids:
        bot.send_message(chat_id=id, text=question,reply_markup=reply_markup)

def build_menu(buttons,n_cols,header_buttons=None,footer_buttons=None):
  menu = [buttons[i:i + n_cols] for i in range(0, len(buttons), n_cols)]
  if header_buttons:
    menu.insert(0, header_buttons)
  if footer_buttons:
    menu.append(footer_buttons)
  return menu

def handle_callback_query(update, context):
    # print(json.loads(update.callback_query.data))
    chat_id = update.callback_query.message.chat_id
    poll_id = json.loads(update.callback_query.data)["poll_id"]
    answer = json.loads(update.callback_query.data)["answer"]
    context.bot.send_message(chat_id=update.effective_chat.id, 
                             text='Your Answer is <b>'+json.loads(update.callback_query.data)["answer"]+'</b>', parse_mode=telegram.ParseMode.HTML)
    update.callback_query.edit_message_reply_markup(None)
    r = requests.post(url = 'http://localhost:5000/add_answer', data = {'chat_id': chat_id, 'poll_id': poll_id, 'answer': answer})


def main() -> None:
    try:
        updater = Updater("5026396246:AAHVsBnqNR0xGLsalEFgRZMRyw2CZT1hKMo")
        dispatcher = updater.dispatcher
        dispatcher.add_handler(CommandHandler("start", start))
        dispatcher.add_handler(CommandHandler("register", register))
        dispatcher.add_handler(CommandHandler("remove", remove))
        dispatcher.add_handler(CommandHandler('poll', poll))
        dispatcher.add_handler(CallbackQueryHandler(handle_callback_query, pattern='.*'))
        # dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))
        updater.start_polling()
        updater.idle()
    except Exception as e:
        pass


if __name__ == '__main__':
    main()