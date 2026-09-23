from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    occupation = Column(String)  # Delivery Partner, Ride-hailing Driver, Freelancer, etc.
    income_source = Column(String)
    risk_preference = Column(String, default="Conservative")  # Conservative, Moderate, Growth-oriented
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("FinancialProfile", back_populates="user", uselist=False)
    incomes = relationship("IncomeTransaction", back_populates="user")
    expenses = relationship("ExpenseTransaction", back_populates="user")
    goals = relationship("FinancialGoal", back_populates="user")

class FinancialProfile(Base):
    __tablename__ = "financial_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    average_daily_income = Column(Float, default=0.0)
    average_monthly_income = Column(Float, default=30000.0)
    income_frequency = Column(String, default="Daily")
    essential_expenses = Column(Float, default=16000.0)
    work_expenses = Column(Float, default=4000.0)
    existing_emi = Column(Float, default=2000.0)
    current_savings = Column(Float, default=18000.0)
    emergency_target = Column(Float, default=30000.0)
    emergency_months = Column(Integer, default=6)
    planning_horizon = Column(String, default="6 Months")
    stability_score = Column(Float, default=75.0)
    updated_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="profile")

class IncomeTransaction(Base):
    __tablename__ = "income_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    source = Column(String)
    amount = Column(Float)
    frequency = Column(String)  # Daily, Weekly, Monthly
    date = Column(String)
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="incomes")

class ExpenseTransaction(Base):
    __tablename__ = "expense_transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    category = Column(String)  # Rent, Food, Fuel, EMI, Shopping, etc.
    group = Column(String)     # Essential, Work, Financial, Discretionary
    amount = Column(Float)
    date = Column(String)
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="expenses")

class FinancialGoal(Base):
    __tablename__ = "financial_goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    target_amount = Column(Float)
    current_amount = Column(Float, default=0.0)
    deadline = Column(String)
    category = Column(String, default="Gadget")

    user = relationship("User", back_populates="goals")
