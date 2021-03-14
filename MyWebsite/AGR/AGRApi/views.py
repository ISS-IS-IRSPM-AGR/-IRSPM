from django.shortcuts import render
from rest_framework import generics, status
from .serializers import UserSerializer,UpdateUserSerializer, RoutineSerializer, RoutineExercisesSerializer
from .models import User,UserData,Routine,RoutineExercises
from .models import get_userid_from_userdb, get_data_from_userdb,get_alluserdata_from_userdb
from .models import User, UserExerciseRating
from rest_framework.views import APIView
from rest_framework.response import Response
from datetime import date

# Create your views here.


class UserView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class LoginUserView(APIView):

    def post(self, request, format=None):
        try:
            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()
            username = request.data.get("username")
            password = request.data.get("password")
            queryset = User.objects.filter(username=username)
            if queryset.exists():
                user = queryset[0]
                if user.username==username and user.password==password:
                    #status:0==> user credential verified okay
                    return Response({"status":0}, status=status.HTTP_200_OK)
                else:
                    #status:1==> user credential verified wrong password
                    return Response({"status":1}, status=status.HTTP_200_OK)
            else:
                #status:2==> user not found
                return Response({"status":2}, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"Bad Request": str(error)}, status=status.HTTP_400_BAD_REQUEST)
        
class SetUserData(APIView):
    def post(self, request, format=None):
        try:
            if not self.request.session.exists(self.request.session.session_key):
                self.request.session.create()
            print(f"requestdata : {request.data}")
            username = request.data.get("username")
            fitness_level = request.data.get("fitness_level")
            gender = request.data.get("gender")
            goal = request.data.get("goal")
            intensity = request.data.get("intensity")
            bmi = request.data.get("bmi")

            user_id = get_userid_from_userdb(username)
            queryset = UserData.objects.filter(user_id=user_id)
            if queryset.exists():
                user = queryset[0]
                if user.user_id==user_id:
                    #status:0==> user credential verified okay
                    if (fitness_level != ""):
                        print(f"print fitness {fitness_level}")
                        user.fitness_level=int(fitness_level)
                    if (goal != ""):
                        print(f"print goal {goal}")
                        user.goal = goal
                    if (gender != ""):
                        print(f"print gender {gender}")
                        user.gender = gender
                    if (intensity != ""):
                        print(f"print intensity {intensity}")
                        user.intensity = int(intensity)
                    if (bmi != None and bmi != ""):
                        print(f"print bmi {bmi}")
                        user.bmi = int(bmi)
                    print(f"print fitness {fitness_level}")
                    user.save()
                    print(user.user_id+5)

                    return Response({"status":0}, status=status.HTTP_200_OK)
                else:
                    #status:1==> user credential verified wrong password
                    return Response({"status":1}, status=status.HTTP_200_OK)
            else:
                #status:2==> user not found
                user_data = UserData(user_id=user.id)
                user_data.save()
                return Response({"status":2}, status=status.HTTP_200_OK)
        except Exception as error:
            print("Exception in SetUserData")
            return Response({"Bad Request": str(error)}, status=status.HTTP_400_BAD_REQUEST)

#currently not used yet 
class GetUserData(APIView):
    def post(self, request, format=None):
        try:
            if not self.request.session.exists(self.request.session.session_key):
                print("AGRApi no session")
                self.request.session.create()
            username = request.data.get("username")
            print(username)
            userdata = get_alluserdata_from_userdb(username)
            return Response({"gender":userdata.gender,
                            "fitness_level":userdata.fitness_level,
                            "goal":userdata.goal,
                            "intensity":userdata.intensity,
                            "bmi":userdata.bmi}, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"Bad Request": str(error)}, status=status.HTTP_400_BAD_REQUEST)

class CreateUserView(APIView):
    serializer_class = UpdateUserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        try:
            CreateUser = request.data.get("CreateUser")
            username = request.data.get("username")
            password = request.data.get("password")
            queryset = User.objects.filter(username=username)
            if CreateUser==0:
                if queryset.exists():
                    user = queryset[0]
                    if user.DOB == request.data.get("DOB"):
                        user.username = username
                        user.password = password
                        user.save(update_fields=["username", "password"])
                        # return Response(UserSerializer(user).data, status=status.HTTP_200_OK) 
                        return Response({"status":0}, status=status.HTTP_200_OK)
                    else:
                        #incorrect data of birth
                        return Response({"status":1}, status=status.HTTP_200_OK)
                else:
                    #incorrect data of birth
                    return Response({"status":2}, status=status.HTTP_200_OK)
            else:
                if queryset.exists():
                    #The same username is stored in database
                    return Response({"status":1}, status=status.HTTP_200_OK)
                else:
                    request.data.pop('CreateUser')
                    serializer = self.serializer_class(data=request.data)
                    if serializer.is_valid(raise_exception=True):
                        fullname = serializer.data.get("fullname")
                        dob = serializer.data.get("DOB")
                        user = User(username=username,fullname=fullname,DOB=dob,password=password)
                        user.save()
                        user_data = UserData(user_id=user.id)
                        user_data.save()
                        # return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
                        return Response({"status":0}, status=status.HTTP_200_OK)
        except Exception as error:
            print(error)
            return Response({"Bad Request": str(error), "status":1}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Bad Request": "Unknown data", "status":2 }, status=status.HTTP_400_BAD_REQUEST)
        
class RoutineView(APIView):
    serializer_class = UpdateUserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        try:
            user_id = request.data.get("user_id") ##need to doublecheck this when running
            set_id = request.data.get("set_id")
            exercise_ids = request.data.get("exercise_ids") ## should get in term of string seperated by # example 43#23#12 --> exercise 43, 23 and 12
            routine = Routine(user_id=user_id, set_id=set_id, date=date.today())
            routine.save()
            set_id = 1 ##how to get set_id? 
            for exercise_id in exercise_ids.split("#"):
                routine_exercise = RoutineExercises(set_id=set_id,exercise_id=exercise_id)
                routine_exercise.save()
            return Response(UserSerializer(user).data, status=status.HTTP_200_OK) 
        except Exception as error:
            return Response({"Bad Request": str(error)}, status=status.HTTP_400_BAD_REQUEST) 

class ModelToLearn(APIView):
    def get(self, request, format=None):
        username = request.GET.get('username')
        queryset = User.objects.filter(username=username)
        try:
            if username!=None:
                user = queryset[0]
                f = open('./FolderToTest/'+username+".txt","w+")
                f.write("This is %s/r/n"%username)
                f.close()
                return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"Bad Request": str(error)}, status=status.HTTP_200_OK)

#empty class
class ExerciseSetView(APIView):
    def get(self, request, format=None):
        return 0 


from AGRApi.recommender_algo_AGR import *
from django_pandas.io import read_frame
from django_pandas.managers import DataFrameManager


class AlgoToLearn(APIView):
    # serializer_class = UpdateUserSerializer

    def post(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()
        try:
            qs = UserExerciseRating.objects.all()
            q = qs.values('user_id', 'exercise_id','user_score')
            df = pd.DataFrame.from_records(q)
            exercise, val, itemid  = recommend_exercise(101, df , n=1, rating_scale=(1, 10))
            return Response({"status":exercise}, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"Bad Request": str(error)}, status=status.HTTP_200_OK)

