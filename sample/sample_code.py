# sample_code.py
# 一个迷你「订单系统」示例，用来演示Code X-Ray。
# 注意函数里的注释刻意写了自然语言关键词，方便你观察「关键词检索」如何命中。

def authenticate_user(username, password):
    # verify user credentials before granting access
    user = db.query("SELECT * FROM users WHERE username=%s", username)
    if user and check_hash(password, user.password_hash):
        return user
    return None

def sanitize_input(user_input):
    # prevent SQL injection by using parameterized queries instead of string concat
    return db.execute("SELECT * FROM logs WHERE msg = %s", (user_input,))

def hash_password(raw_password):
    # securely hash password with bcrypt before storing
    return bcrypt.generate_password_hash(raw_password)

def send_welcome_email(address, name):
    # send a welcome email to the newly registered user
    mailer.send(to=address, subject="Welcome " + name, body="Thanks for joining!")

def calculate_order_total(items):
    # sum up the price of all items to get the order total
    return sum(item.price * item.qty for item in items)

def apply_discount(price, percent):
    # apply a percentage discount to the original price
    return price * (1 - percent / 100.0)

def fetch_user_orders(user_id):
    # retrieve all orders belonging to a given user from the database
    return db.query("SELECT * FROM orders WHERE user_id=%s", user_id)

def generate_report_csv(rows):
    # write the given data rows into a downloadable CSV report file
    with open("report.csv", "w") as f:
        for r in rows:
            f.write(",".join(map(str, r)) + "\n")

def cache_get(key):
    # read a value from the in-memory cache by key
    return memory_cache.get(key)

def cache_set(key, value, ttl=60):
    # store a value in the cache with a time-to-live
    memory_cache.set(key, value, expire=ttl)

def retry_on_failure(func, attempts=3):
    # retry the given function call several times before giving up
    for i in range(attempts):
        try:
            return func()
        except Exception:
            continue
    return None

def log_error(message):
    # record an error message into the error log file
    with open("error.log", "a") as f:
        f.write(message + "\n")

def normalize_phone_number(phone):
    # strip spaces and dashes to get a standard phone number format
    return "".join(ch for ch in phone if ch.isdigit())
