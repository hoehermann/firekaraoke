#!/usr/bin/env python3
# -*- coding: UTF-8 -*-
'''
CREATE TABLE `ratings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `song_id` mediumint(8) unsigned NOT NULL,
  `ip` varchar(160) NOT NULL,
  `rating` varchar(200) NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ratings_UN` (`ip`,`song_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4
'''
import os
import mysql.connector
import pwd
import json
import sys
remote_ip = '127.0.0.1'
song_id = 0
rating = 'test'
connection = None
# https://stackoverflow.com/questions/477816/what-is-the-correct-json-content-type
print('Content-Type: application/json;charset=utf-8')
try:
    if 'SERVER_ADDR' in os.environ:
        remote_ip = os.environ['REMOTE_ADDR']
        j = json.loads(sys.stdin.read())
        song_id = j['song_id']
        rating = j['rating']
    connection = mysql.connector.connect(
        user = pwd.getpwuid(os.getuid()).pw_name, 
        unix_socket = '/var/run/mysqld/mysqld.sock',
        database = 'karaoke'
    )
    cursor = connection.cursor()
    cursor.execute(
        'INSERT INTO ratings (ip, song_id, rating) VALUES (%s, %s, %s)', 
        (remote_ip, song_id, rating.encode(errors='ignore'))
    )
    connection.commit()
    print('')
    print('{"rows": %d}'%(cursor.rowcount))
except mysql.connector.errors.IntegrityError as e:
    print('Status: 409 Duplicate Rntry')
    print('')
    print('{"error": "%s"}'%(e))
    if (connection):
        connection.rollback()
except Exception as e:
    print('Status: 500 Server Error')
    print('')
    print('{"error": "%s"}'%(e))
    if (connection):
        connection.rollback()
connection.close()
