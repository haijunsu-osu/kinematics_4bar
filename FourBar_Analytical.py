"""
Analytical Kinematic Analysis of Planar 4-Bar Linkage
Converted from FourBar_PositionAnalysis.m (MATLAB) based on Kinzel's book and lecture notes.
"""
import numpy as np
import matplotlib.pyplot as plt

# Link lengths (example values from Kinzel's book)
r1 = 1
r2 = 2
r3 = 3.5
r4 = 4
th1 = 0
beta = np.arctan(1/2)  # coupler angle
r6 = 2 / np.cos(beta)   # length AE

# Input crank angles (degrees to radians)
th2 = np.deg2rad(np.arange(0, 361, 10))

th3 = np.zeros_like(th2)
th4 = np.zeros_like(th2)

posA = np.zeros((len(th2), 2))
posB = np.zeros((len(th2), 2))
posE = np.zeros((len(th2), 2))
posOA = np.array([0, 0])
posOB = np.array([1, 0])

sigma = 1  # assembly mode

for i in range(len(th2)):
    A = 2 * r1 * r4 * np.cos(th1) - 2 * r2 * r4 * np.cos(th2[i])
    B = 2 * r1 * r4 * np.sin(th1) - 2 * r2 * r4 * np.sin(th2[i])
    C = r1**2 + r2**2 + r4**2 - r3**2 - 2 * r1 * r2 * np.cos(th1 - th2[i])

    # Position analysis
    th4[i] = 2 * np.arctan((-B + sigma * np.sqrt(B**2 - C**2 + A**2)) / (C - A))
    th3[i] = np.arctan2(
        r1 * np.sin(th1) + r4 * np.sin(th4[i]) - r2 * np.sin(th2[i]),
        r1 * np.cos(th1) + r4 * np.cos(th4[i]) - r2 * np.cos(th2[i])
    )

    # Coupler point E
    posA[i] = r2 * np.array([np.cos(th2[i]), np.sin(th2[i])])
    posB[i] = posA[i] + r3 * np.array([np.cos(th3[i]), np.sin(th3[i])])
    posE[i] = posA[i] + r6 * np.array([np.cos(th3[i] + beta), np.sin(th3[i] + beta)])

    linkage = np.vstack([posOA, posA[i], posE[i], posB[i], posA[i], posB[i], posOB])
    plt.clf()
    plt.plot(linkage[:, 0], linkage[:, 1], marker='o', label='Linkage')
    # Plot trajectory of coupler point E up to current step
    plt.plot(posE[:i+1, 0], posE[:i+1, 1], 'r--', label='Coupler E Trajectory')
    plt.axis([-5, 5, -5, 5])
    plt.title(f'4-Bar Linkage Position (Step {i+1})')
    plt.legend()
    plt.pause(0.1)

plt.figure()
plt.plot(np.rad2deg(th2), np.rad2deg(th3), label='Coupler Angle th3')
plt.plot(np.rad2deg(th2), np.rad2deg(th4), label='Output Angle th4')
plt.xlabel('Crank Angle (deg)')
plt.ylabel('Angle (deg)')
plt.title('Coupler and Output Angles vs. Input Crank Angle')
plt.grid(True)
plt.legend()
plt.show()
