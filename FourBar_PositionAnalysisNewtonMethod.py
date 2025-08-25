"""
Four-Bar Analysis using Newton Iteration (Numerical Solver)
Combined from FourBar_PositionAnalysisNewtonMethod.m and vecloopeq.m
Solves the kinematics equations of a planar 4-bar linkage using fsolve (Newton's method)
"""
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import fsolve

# Link lengths and parameters
r1 = 1
r2 = 2
r3 = 3.5
r4 = 4
th1 = 0
beta = np.arctan(1/2)  # coupler angle
r6 = 2 / np.cos(beta)   # length AE

th2list = np.deg2rad(np.arange(0, 361, 1))  # driver angles
n = len(th2list)

th3list = np.zeros(n)
th4list = np.zeros(n)
pAlist = np.zeros((n, 2))
pBlist = np.zeros((n, 2))
pElist = np.zeros((n, 2))

OB = np.array([1, 0])

# Vector loop equation for 4-bar linkage
def vecloopeq(x, th1, th2, r1, r2, r3, r4):
    th3, th4 = x
    eq1 = r2 * np.cos(th2) + r3 * np.cos(th3) - r4 * np.cos(th4) - r1 * np.cos(th1)
    eq2 = r2 * np.sin(th2) + r3 * np.sin(th3) - r4 * np.sin(th4) - r1 * np.sin(th1)
    return [eq1, eq2]

# Initial guess for [th3, th4]
th2 = th2list[0]
x0 = [-np.pi/3, -np.pi/3]

for i, th2 in enumerate(th2list):
    f = lambda x: vecloopeq(x, th1, th2, r1, r2, r3, r4)
    solth3th4 = fsolve(f, x0)
    th3, th4 = solth3th4
    th3list[i] = th3
    th4list[i] = th4
    x0 = solth3th4  # use previous solution as next initial guess

    pA = r2 * np.array([np.cos(th2), np.sin(th2)])
    pB = OB + r4 * np.array([np.cos(th4), np.sin(th4)])
    pE = pA + r6 * np.array([np.cos(th3 + beta), np.sin(th3 + beta)])

    pAlist[i] = pA
    pBlist[i] = pB 
    pElist[i] = pE

plt.figure()
plt.plot(th2list, th3list, label='Coupler Angle th3')
plt.plot(th2list, th4list, label='Output Angle th4')
plt.xlabel('Crank Angle (rad)')
plt.figure()
plt.plot(pElist[:,0], pElist[:,1], 'r-', label='Coupler Point E Trajectory')
plt.xlabel('X Position')
plt.ylabel('Y Position')
plt.title('Trajectory of Coupler Point E')
plt.axis('equal')
plt.grid(True)
plt.legend()
plt.ylabel('Angle (rad)')
plt.title('Coupler and Output Angles vs. Input Crank Angle')
plt.grid(True)
plt.legend()
plt.show()
