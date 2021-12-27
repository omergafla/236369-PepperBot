from telegram import Update, ForceReply
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext
import requests


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
    #     sql_query_string = f"INSERT INTO users (effective_id, username, created_at) VALUES ({effective_id}, '{username}', '{created_at}')"
    #     result = sql_call(sql_query_string)
    #     update.message.reply_text("Thanks!")
    # except DatabaseException.UNIQUE_VIOLATION as e:
    #     update.message.reply_text("Already registered")
    # except Exception as e:
    #     update.message.reply_text("Oops!")


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



def main() -> None:
    try:
        updater = Updater("5026396246:AAHVsBnqNR0xGLsalEFgRZMRyw2CZT1hKMo")
        dispatcher = updater.dispatcher
        dispatcher.add_handler(CommandHandler("start", start))
        dispatcher.add_handler(CommandHandler("register", register))
        dispatcher.add_handler(CommandHandler("remove", remove))
        # dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, echo))
        updater.start_polling()
        updater.idle()
    except Exception as e:
        pass


if __name__ == '__main__':
    main()