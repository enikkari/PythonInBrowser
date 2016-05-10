import turtle

class Turtle(turtle.Turtle):
    def __init__(self):
        turtle.Turtle.__init__(self)
        self.shape('turtle')

    def jumpTo(self, x, y=None):
        was_down = self.isdown()
        self.penup()
        self.goto(x, y)
        if was_down:
            self.pendown()

def pauseDrawing():
  turtle.tracer(10000)

def unpauseDrawing():
  turtle.update()
  turtle.tracer(1)
