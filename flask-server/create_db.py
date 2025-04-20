from app import app
from models import db, Customer, Order
from user import User

def init_db():
    with app.app_context():
        # Create all tables
        db.create_all()
        
        # Add a default admin user if no users exist
        if not User.query.first():
            admin = User(username='admin')
            admin.set_password('admin')
            db.session.add(admin)
            db.session.commit()
            print("Created default admin user")

if __name__ == '__main__':
    init_db()