#ifndef __jeepney_platform_h
#define __jeepney_platform_h

#ifdef _WIN64
#define MS_WIN64
#endif

#ifndef _W64
#define _W64
#endif

#ifdef MS_WIN64
typedef __int64 ssize_t;
#else
typedef _W64 int ssize_t;
#endif

#endif